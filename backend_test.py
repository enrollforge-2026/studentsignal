#!/usr/bin/env python3
"""
Student Signal Backend API Testing Suite
Tests all backend API endpoints for functionality and data integrity
"""

import requests
import json
import sys
import os
from typing import Dict, Any, Optional

# Get backend URL from frontend .env file
def get_backend_url():
    """Read REACT_APP_BACKEND_URL from frontend/.env"""
    env_path = "/app/frontend/.env"
    try:
        with open(env_path, 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        print(f"❌ Could not find {env_path}")
        return None
    return None

# Global variables
BASE_URL = get_backend_url()
if not BASE_URL:
    print("❌ Could not determine backend URL")
    sys.exit(1)

API_BASE = f"{BASE_URL}/api"
AUTH_TOKEN = None
TEST_USER_EMAIL = "sarah.johnson@example.com"
TEST_USER_PASSWORD = "SecurePass123!"

class APITester:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        self.test_results = []
        self.college_id = None
        self.scholarship_id = None
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅" if success else "❌"
        print(f"{status} {test_name}")
        if details:
            print(f"   {details}")
        self.test_results.append({
            'test': test_name,
            'success': success,
            'details': details
        })
        
    def make_request(self, method: str, endpoint: str, data: Dict = None, params: Dict = None, auth_required: bool = False) -> tuple:
        """Make HTTP request and return (success, response, status_code)"""
        url = f"{API_BASE}{endpoint}"
        headers = {}
        
        if auth_required and AUTH_TOKEN:
            headers['Authorization'] = f"Bearer {AUTH_TOKEN}"
            
        try:
            if method.upper() == 'GET':
                response = self.session.get(url, params=params, headers=headers, timeout=30)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data, params=params, headers=headers, timeout=30)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url, headers=headers, timeout=30)
            else:
                return False, None, 0
                
            return True, response, response.status_code
        except requests.exceptions.RequestException as e:
            return False, str(e), 0
    
    def test_root_endpoint(self):
        """Test GET /api/ - Root endpoint"""
        print("\n🔍 Testing Root Endpoint...")
        
        success, response, status_code = self.make_request('GET', '/')
        
        if not success:
            self.log_test("Root endpoint connectivity", False, f"Connection failed: {response}")
            return False
            
        if status_code != 200:
            self.log_test("Root endpoint status", False, f"Expected 200, got {status_code}")
            return False
            
        try:
            data = response.json()
            required_fields = ['message', 'version', 'endpoints']
            
            if all(field in data for field in required_fields):
                self.log_test("Root endpoint structure", True, f"Version: {data.get('version')}")
                return True
            else:
                self.log_test("Root endpoint structure", False, f"Missing fields: {set(required_fields) - set(data.keys())}")
                return False
        except json.JSONDecodeError:
            self.log_test("Root endpoint JSON", False, "Invalid JSON response")
            return False
    
    def test_colleges_endpoints(self):
        """Test all college-related endpoints"""
        print("\n🏫 Testing College Endpoints...")
        
        # Test GET /api/colleges - List all colleges
        success, response, status_code = self.make_request('GET', '/colleges')
        
        if not success or status_code != 200:
            self.log_test("Colleges list endpoint", False, f"Failed to get colleges: {status_code}")
            return False
            
        try:
            data = response.json()
            colleges = data.get('colleges', [])
            total = data.get('total', 0)
            
            if len(colleges) == 8 and total == 8:
                self.log_test("Colleges list count", True, f"Found {len(colleges)} colleges")
                # Store first college ID for later tests
                if colleges:
                    self.college_id = colleges[0].get('id')
            else:
                self.log_test("Colleges list count", False, f"Expected 8 colleges, got {len(colleges)}")
                
        except json.JSONDecodeError:
            self.log_test("Colleges list JSON", False, "Invalid JSON response")
            return False
        
        # Test search functionality
        success, response, status_code = self.make_request('GET', '/colleges', params={'search': 'Stanford'})
        if success and status_code == 200:
            data = response.json()
            colleges = data.get('colleges', [])
            if any('Stanford' in college.get('name', '') for college in colleges):
                self.log_test("Colleges search", True, f"Found {len(colleges)} Stanford results")
            else:
                self.log_test("Colleges search", False, "Stanford not found in search results")
        else:
            self.log_test("Colleges search", False, f"Search failed: {status_code}")
        
        # Test state filter
        success, response, status_code = self.make_request('GET', '/colleges', params={'state': 'CA'})
        if success and status_code == 200:
            data = response.json()
            colleges = data.get('colleges', [])
            ca_colleges = [c for c in colleges if c.get('state') == 'CA']
            if ca_colleges:
                self.log_test("Colleges state filter", True, f"Found {len(ca_colleges)} CA colleges")
            else:
                self.log_test("Colleges state filter", False, "No CA colleges found")
        else:
            self.log_test("Colleges state filter", False, f"State filter failed: {status_code}")
        
        # Test type filter
        success, response, status_code = self.make_request('GET', '/colleges', params={'type': 'Public'})
        if success and status_code == 200:
            data = response.json()
            colleges = data.get('colleges', [])
            public_colleges = [c for c in colleges if c.get('type') == 'Public']
            if public_colleges:
                self.log_test("Colleges type filter", True, f"Found {len(public_colleges)} Public colleges")
            else:
                self.log_test("Colleges type filter", False, "No Public colleges found")
        else:
            self.log_test("Colleges type filter", False, f"Type filter failed: {status_code}")
        
        # Test pagination
        success, response, status_code = self.make_request('GET', '/colleges', params={'page': 1, 'limit': 5})
        if success and status_code == 200:
            data = response.json()
            colleges = data.get('colleges', [])
            if len(colleges) <= 5:
                self.log_test("Colleges pagination", True, f"Pagination working: {len(colleges)} results")
            else:
                self.log_test("Colleges pagination", False, f"Expected ≤5 results, got {len(colleges)}")
        else:
            self.log_test("Colleges pagination", False, f"Pagination failed: {status_code}")
        
        # Test single college endpoint
        if self.college_id:
            success, response, status_code = self.make_request('GET', f'/colleges/{self.college_id}')
            if success and status_code == 200:
                try:
                    college = response.json()
                    if college.get('id') == self.college_id:
                        self.log_test("Single college endpoint", True, f"Retrieved college: {college.get('name')}")
                    else:
                        self.log_test("Single college endpoint", False, "College ID mismatch")
                except json.JSONDecodeError:
                    self.log_test("Single college endpoint", False, "Invalid JSON response")
            else:
                self.log_test("Single college endpoint", False, f"Failed to get college: {status_code}")
        else:
            self.log_test("Single college endpoint", False, "No college ID available for testing")
        
        return True
    
    def test_scholarships_endpoints(self):
        """Test all scholarship-related endpoints"""
        print("\n🎓 Testing Scholarship Endpoints...")
        
        # Test GET /api/scholarships - List all scholarships
        success, response, status_code = self.make_request('GET', '/scholarships')
        
        if not success or status_code != 200:
            self.log_test("Scholarships list endpoint", False, f"Failed to get scholarships: {status_code}")
            return False
            
        try:
            data = response.json()
            scholarships = data.get('scholarships', [])
            total = data.get('total', 0)
            
            if len(scholarships) == 8 and total == 8:
                self.log_test("Scholarships list count", True, f"Found {len(scholarships)} scholarships")
                # Store first scholarship ID for later tests
                if scholarships:
                    self.scholarship_id = scholarships[0].get('id')
            else:
                self.log_test("Scholarships list count", False, f"Expected 8 scholarships, got {len(scholarships)}")
                
        except json.JSONDecodeError:
            self.log_test("Scholarships list JSON", False, "Invalid JSON response")
            return False
        
        # Test category filter
        success, response, status_code = self.make_request('GET', '/scholarships', params={'category': 'STEM'})
        if success and status_code == 200:
            data = response.json()
            scholarships = data.get('scholarships', [])
            stem_scholarships = [s for s in scholarships if 'STEM' in s.get('category', '')]
            if stem_scholarships:
                self.log_test("Scholarships category filter", True, f"Found {len(stem_scholarships)} STEM scholarships")
            else:
                self.log_test("Scholarships category filter", False, "No STEM scholarships found")
        else:
            self.log_test("Scholarships category filter", False, f"Category filter failed: {status_code}")
        
        # Test renewable filter
        success, response, status_code = self.make_request('GET', '/scholarships', params={'renewable': 'true'})
        if success and status_code == 200:
            data = response.json()
            scholarships = data.get('scholarships', [])
            renewable_scholarships = [s for s in scholarships if s.get('renewable') == True]
            if renewable_scholarships:
                self.log_test("Scholarships renewable filter", True, f"Found {len(renewable_scholarships)} renewable scholarships")
            else:
                self.log_test("Scholarships renewable filter", False, "No renewable scholarships found")
        else:
            self.log_test("Scholarships renewable filter", False, f"Renewable filter failed: {status_code}")
        
        # Test search functionality
        success, response, status_code = self.make_request('GET', '/scholarships', params={'search': 'Merit'})
        if success and status_code == 200:
            data = response.json()
            scholarships = data.get('scholarships', [])
            merit_scholarships = [s for s in scholarships if 'Merit' in s.get('name', '') or 'Merit' in s.get('description', '')]
            if merit_scholarships:
                self.log_test("Scholarships search", True, f"Found {len(merit_scholarships)} Merit scholarships")
            else:
                self.log_test("Scholarships search", False, "No Merit scholarships found")
        else:
            self.log_test("Scholarships search", False, f"Search failed: {status_code}")
        
        # Test single scholarship endpoint
        if self.scholarship_id:
            success, response, status_code = self.make_request('GET', f'/scholarships/{self.scholarship_id}')
            if success and status_code == 200:
                try:
                    scholarship = response.json()
                    if scholarship.get('id') == self.scholarship_id:
                        self.log_test("Single scholarship endpoint", True, f"Retrieved scholarship: {scholarship.get('name')}")
                    else:
                        self.log_test("Single scholarship endpoint", False, "Scholarship ID mismatch")
                except json.JSONDecodeError:
                    self.log_test("Single scholarship endpoint", False, "Invalid JSON response")
            else:
                self.log_test("Single scholarship endpoint", False, f"Failed to get scholarship: {status_code}")
        else:
            self.log_test("Single scholarship endpoint", False, "No scholarship ID available for testing")
        
        return True
    
    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        print("\n🔐 Testing Authentication Endpoints...")
        global AUTH_TOKEN
        
        # Test user registration
        user_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD,
            "first_name": "Sarah",
            "last_name": "Johnson"
        }
        
        success, response, status_code = self.make_request('POST', '/auth/register', data=user_data)
        
        if success and status_code == 200:
            try:
                data = response.json()
                if 'token' in data and 'user' in data:
                    AUTH_TOKEN = data['token']
                    self.log_test("User registration", True, f"Registered user: {data['user'].get('email')}")
                else:
                    self.log_test("User registration", False, "Missing token or user in response")
            except json.JSONDecodeError:
                self.log_test("User registration", False, "Invalid JSON response")
        elif status_code == 400:
            # User might already exist, try login instead
            self.log_test("User registration", True, "User already exists (expected)")
        else:
            self.log_test("User registration", False, f"Registration failed: {status_code}")
        
        # Test user login
        login_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        }
        
        success, response, status_code = self.make_request('POST', '/auth/login', data=login_data)
        
        if success and status_code == 200:
            try:
                data = response.json()
                if 'token' in data and 'user' in data:
                    AUTH_TOKEN = data['token']
                    self.log_test("User login", True, f"Logged in user: {data['user'].get('email')}")
                else:
                    self.log_test("User login", False, "Missing token or user in response")
            except json.JSONDecodeError:
                self.log_test("User login", False, "Invalid JSON response")
        else:
            self.log_test("User login", False, f"Login failed: {status_code}")
        
        # Test get current user
        if AUTH_TOKEN:
            success, response, status_code = self.make_request('GET', '/auth/me', auth_required=True)
            
            if success and status_code == 200:
                try:
                    user = response.json()
                    if user.get('email') == TEST_USER_EMAIL:
                        self.log_test("Get current user", True, f"Retrieved user: {user.get('email')}")
                    else:
                        self.log_test("Get current user", False, "User email mismatch")
                except json.JSONDecodeError:
                    self.log_test("Get current user", False, "Invalid JSON response")
            else:
                self.log_test("Get current user", False, f"Failed to get user: {status_code}")
        else:
            self.log_test("Get current user", False, "No auth token available")
        
        return AUTH_TOKEN is not None
    
    def test_saved_items_endpoints(self):
        """Test saved items endpoints (requires authentication)"""
        print("\n💾 Testing Saved Items Endpoints...")
        
        if not AUTH_TOKEN:
            self.log_test("Saved items authentication", False, "No auth token available")
            return False
        
        # Test save college
        if self.college_id:
            save_data = {"item_id": self.college_id, "item_type": "college"}
            success, response, status_code = self.make_request('POST', '/users/saved-colleges', data=save_data, auth_required=True)
            
            if success and status_code == 200:
                self.log_test("Save college", True, "College saved successfully")
            else:
                self.log_test("Save college", False, f"Failed to save college: {status_code}")
        else:
            self.log_test("Save college", False, "No college ID available")
        
        # Test get saved colleges
        success, response, status_code = self.make_request('GET', '/users/saved-colleges', auth_required=True)
        
        if success and status_code == 200:
            try:
                colleges = response.json()
                if isinstance(colleges, list):
                    self.log_test("Get saved colleges", True, f"Retrieved {len(colleges)} saved colleges")
                else:
                    self.log_test("Get saved colleges", False, "Response is not a list")
            except json.JSONDecodeError:
                self.log_test("Get saved colleges", False, "Invalid JSON response")
        else:
            self.log_test("Get saved colleges", False, f"Failed to get saved colleges: {status_code}")
        
        # Test save scholarship
        if self.scholarship_id:
            save_data = {"item_id": self.scholarship_id, "item_type": "scholarship"}
            success, response, status_code = self.make_request('POST', '/users/saved-scholarships', data=save_data, auth_required=True)
            
            if success and status_code == 200:
                self.log_test("Save scholarship", True, "Scholarship saved successfully")
            else:
                self.log_test("Save scholarship", False, f"Failed to save scholarship: {status_code}")
        else:
            self.log_test("Save scholarship", False, "No scholarship ID available")
        
        # Test get saved scholarships
        success, response, status_code = self.make_request('GET', '/users/saved-scholarships', auth_required=True)
        
        if success and status_code == 200:
            try:
                scholarships = response.json()
                if isinstance(scholarships, list):
                    self.log_test("Get saved scholarships", True, f"Retrieved {len(scholarships)} saved scholarships")
                else:
                    self.log_test("Get saved scholarships", False, "Response is not a list")
            except json.JSONDecodeError:
                self.log_test("Get saved scholarships", False, "Invalid JSON response")
        else:
            self.log_test("Get saved scholarships", False, f"Failed to get saved scholarships: {status_code}")
        
        # Test remove saved college
        if self.college_id:
            success, response, status_code = self.make_request('DELETE', f'/users/saved-colleges/{self.college_id}', auth_required=True)
            
            if success and status_code == 200:
                self.log_test("Remove saved college", True, "College removed successfully")
            else:
                self.log_test("Remove saved college", False, f"Failed to remove college: {status_code}")
        
        return True
    
    def test_ipeds_endpoint(self):
        """Test IPEDS status endpoint"""
        print("\n📊 Testing IPEDS Endpoint...")
        
        success, response, status_code = self.make_request('GET', '/ipeds/status')
        
        if success and status_code == 200:
            try:
                data = response.json()
                required_fields = ['total_records', 'status']
                
                if all(field in data for field in required_fields):
                    self.log_test("IPEDS status endpoint", True, f"Status: {data.get('status')}, Records: {data.get('total_records')}")
                else:
                    self.log_test("IPEDS status endpoint", False, f"Missing fields: {set(required_fields) - set(data.keys())}")
            except json.JSONDecodeError:
                self.log_test("IPEDS status endpoint", False, "Invalid JSON response")
        else:
            self.log_test("IPEDS status endpoint", False, f"Failed to get IPEDS status: {status_code}")
        
        return True
    
    def run_all_tests(self):
        """Run all API tests"""
        print(f"🚀 Starting Student Signal Backend API Tests")
        print(f"📍 Testing against: {API_BASE}")
        print("=" * 60)
        
        # Run all test suites
        self.test_root_endpoint()
        self.test_colleges_endpoints()
        self.test_scholarships_endpoints()
        self.test_auth_endpoints()
        self.test_saved_items_endpoints()
        self.test_ipeds_endpoint()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📋 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {total - passed}")
        print(f"📊 Success Rate: {(passed/total)*100:.1f}%")
        
        # Show failed tests
        failed_tests = [result for result in self.test_results if not result['success']]
        if failed_tests:
            print(f"\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"   • {test['test']}: {test['details']}")
        
        return passed == total


def main():
    """Main test execution"""
    if not BASE_URL:
        print("❌ Could not determine backend URL from frontend/.env")
        return False
    
    print(f"🔗 Backend URL: {BASE_URL}")
    
    tester = APITester()
    success = tester.run_all_tests()
    
    if success:
        print(f"\n🎉 All tests passed! Backend API is working correctly.")
        return True
    else:
        print(f"\n⚠️  Some tests failed. Check the details above.")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)