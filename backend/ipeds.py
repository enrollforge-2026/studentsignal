import pandas as pd
import requests
from typing import List, Dict
from datetime import datetime
from models import College
import os
import logging

logger = logging.getLogger(__name__)


class IPEDSIntegration:
    """
    IPEDS (Integrated Postsecondary Education Data System) Data Integration
    This class handles fetching and parsing IPEDS data for colleges.
    """
    
    # IPEDS data URLs (these would be actual IPEDS CSV file URLs)
    IPEDS_BASE_URL = "https://nces.ed.gov/ipeds/datacenter/data/"
    
    # Field mappings from IPEDS to our schema
    FIELD_MAPPINGS = {
        'UNITID': 'ipeds_id',
        'INSTNM': 'name',
        'CITY': 'city',
        'STABBR': 'state',
        'CONTROL': 'control',
        'ENRTOT': 'enrollment',
        'ADMSSN': 'admissions',
        'APPLCN': 'applications',
        'ACTCMMID': 'act_composite',
        'SATMT25': 'sat_math_25',
        'SATMT75': 'sat_math_75',
        'SATVR25': 'sat_verbal_25',
        'SATVR75': 'sat_verbal_75',
        'TUFEYR3': 'tuition_in_state',
        'TUFEYR2': 'tuition_out_state',
        'RET_PCF': 'retention_rate',
        'GRADS': 'graduates'
    }
    
    def __init__(self):
        self.data_cache = None
    
    def parse_ipeds_csv(self, csv_file_path: str) -> List[Dict]:
        """
        Parse IPEDS CSV file and convert to our college format
        """
        try:
            df = pd.read_csv(csv_file_path, encoding='latin-1')
            colleges = []
            
            for _, row in df.iterrows():
                try:
                    college = self._convert_ipeds_row_to_college(row)
                    if college:
                        colleges.append(college)
                except Exception as e:
                    logger.error(f"Error parsing row: {e}")
                    continue
            
            return colleges
        
        except Exception as e:
            logger.error(f"Error reading IPEDS CSV: {e}")
            return []
    
    def _convert_ipeds_row_to_college(self, row: pd.Series) -> Dict:
        """
        Convert a single IPEDS row to our College model format
        """
        try:
            # Calculate acceptance rate
            admissions = row.get('ADMSSN', 0)
            applications = row.get('APPLCN', 1)
            acceptance_rate = (admissions / applications * 100) if applications > 0 else 0
            
            # Determine institution type
            control = row.get('CONTROL', 1)
            institution_type = 'Public' if control == 1 else 'Private'
            
            # Calculate SAT ranges
            sat_math_25 = row.get('SATMT25', 0)
            sat_math_75 = row.get('SATMT75', 0)
            sat_verbal_25 = row.get('SATVR25', 0)
            sat_verbal_75 = row.get('SATVR75', 0)
            
            sat_composite_25 = sat_math_25 + sat_verbal_25 if sat_math_25 and sat_verbal_25 else 0
            sat_composite_75 = sat_math_75 + sat_verbal_75 if sat_math_75 and sat_verbal_75 else 0
            
            sat_range = f"{int(sat_composite_25)}-{int(sat_composite_75)}" if sat_composite_25 > 0 else "N/A"
            
            # ACT range
            act_composite = row.get('ACTCMMID', 0)
            act_range = f"{int(act_composite)-2}-{int(act_composite)+2}" if act_composite > 0 else "N/A"
            
            # Build location string
            city = row.get('CITY', '')
            state = row.get('STABBR', '')
            location = f"{city}, {state}" if city and state else state
            
            # Create college dictionary
            college = {
                'ipeds_id': str(row.get('UNITID', '')),
                'name': row.get('INSTNM', ''),
                'short_name': row.get('INSTNM', '').split()[0] if row.get('INSTNM') else '',
                'location': location,
                'state': state,
                'type': institution_type,
                'enrollment': int(row.get('ENRTOT', 0)),
                'acceptance_rate': round(acceptance_rate, 1),
                'tuition_in_state': int(row.get('TUFEYR3', 0)),
                'tuition_out_state': int(row.get('TUFEYR2', 0)),
                'sat_range': sat_range,
                'act_range': act_range,
                'graduation_rate': float(row.get('RET_PCF', 0)),
                'ranking': None,
                'rating': None,
                'image': 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
                'description': f"{row.get('INSTNM', '')} is located in {location}.",
                'direct_admission': False,
                'majors': [],
                'features': []
            }
            
            return college
            
        except Exception as e:
            logger.error(f"Error converting IPEDS row: {e}")
            return None
    
    async def sync_ipeds_data(self, csv_file_path: str, db) -> Dict:
        """
        Sync IPEDS data to MongoDB
        """
        try:
            colleges = self.parse_ipeds_csv(csv_file_path)
            
            updated = 0
            failed = 0
            
            for college_data in colleges:
                try:
                    # Add timestamps
                    college_data['created_at'] = datetime.utcnow().isoformat()
                    college_data['updated_at'] = datetime.utcnow().isoformat()
                    
                    # Upsert (update if exists, insert if not)
                    result = await db.colleges.update_one(
                        {'ipeds_id': college_data['ipeds_id']},
                        {'$set': college_data},
                        upsert=True
                    )
                    
                    if result.modified_count > 0 or result.upserted_id:
                        updated += 1
                except Exception as e:
                    logger.error(f"Error syncing college {college_data.get('name')}: {e}")
                    failed += 1
            
            # Update sync status
            sync_status = {
                'last_sync': datetime.utcnow().isoformat(),
                'total_records': len(colleges),
                'updated': updated,
                'failed': failed,
                'status': 'completed'
            }
            
            await db.ipeds_sync.insert_one(sync_status)
            
            return sync_status
            
        except Exception as e:
            logger.error(f"Error syncing IPEDS data: {e}")
            return {
                'status': 'failed',
                'error': str(e),
                'last_sync': datetime.utcnow().isoformat()
            }
    
    def download_ipeds_csv(self, year: int, dataset: str = 'HD') -> str:
        """
        Download IPEDS CSV file from NCES website
        Dataset options: HD (Directory), IC (Institutional Characteristics), ADM (Admissions)
        """
        # This is a placeholder - actual implementation would download from IPEDS
        # For now, we'll expect users to manually download and provide the CSV
        raise NotImplementedError("IPEDS CSV download not implemented. Please provide CSV file path.")


# Sample data generator for testing
def generate_sample_ipeds_data() -> pd.DataFrame:
    """
    Generate sample IPEDS-like data for testing
    """
    sample_data = {
        'UNITID': ['100654', '110635', '120883', '130794', '140755'],
        'INSTNM': ['Harvard University', 'Stanford University', 'MIT', 'Yale University', 'Princeton University'],
        'CITY': ['Cambridge', 'Stanford', 'Cambridge', 'New Haven', 'Princeton'],
        'STABBR': ['MA', 'CA', 'MA', 'CT', 'NJ'],
        'CONTROL': [2, 2, 2, 2, 2],  # 1=Public, 2=Private
        'ENRTOT': [23000, 17000, 11500, 13600, 8500],
        'ADMSSN': [1954, 2190, 1410, 2169, 1498],
        'APPLCN': [43330, 47450, 21706, 35220, 31056],
        'ACTCMMID': [34, 34, 35, 34, 34],
        'SATMT25': [740, 740, 760, 740, 750],
        'SATMT75': [800, 790, 800, 800, 800],
        'SATVR25': [720, 710, 720, 720, 730],
        'SATVR75': [780, 770, 780, 780, 790],
        'TUFEYR3': [51904, 56169, 53790, 59950, 56010],
        'TUFEYR2': [51904, 56169, 53790, 59950, 56010],
        'RET_PCF': [98, 98, 99, 99, 98]
    }
    
    return pd.DataFrame(sample_data)
