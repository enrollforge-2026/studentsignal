#!/usr/bin/env python3
"""
IPEDS 2022 Data Engine - Balanced Merge
Merges 8 CSV files into one master colleges dataset
"""

import pandas as pd
import json
import numpy as np
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# File paths
FILES = {
    'hd': 'https://customer-assets.emergentagent.com/job_c75fe3e0-4e5c-4975-bee9-e2c7bc386ea4/artifacts/reba0q6c_hd2022.csv',
    'adm': 'https://customer-assets.emergentagent.com/job_c75fe3e0-4e5c-4975-bee9-e2c7bc386ea4/artifacts/kyk9q28b_adm2022_rv.csv',
    'ef': 'https://customer-assets.emergentagent.com/job_c75fe3e0-4e5c-4975-bee9-e2c7bc386ea4/artifacts/u80bitk5_ef2022a_rv.csv',
    'sfa': 'https://customer-assets.emergentagent.com/job_c75fe3e0-4e5c-4975-bee9-e2c7bc386ea4/artifacts/bwwjye89_sfa2122_rv.csv',
    'ic_ay': 'https://customer-assets.emergentagent.com/job_c75fe3e0-4e5c-4975-bee9-e2c7bc386ea4/artifacts/zogqkocb_ic2022_ay.csv',
    'gr': 'https://customer-assets.emergentagent.com/job_c75fe3e0-4e5c-4975-bee9-e2c7bc386ea4/artifacts/movnc1fk_gr2022_rv.csv',
    'gr200': 'https://customer-assets.emergentagent.com/job_c75fe3e0-4e5c-4975-bee9-e2c7bc386ea4/artifacts/zoqv6qh1_gr200_22_rv.csv',
    'ic_rv': 'https://customer-assets.emergentagent.com/job_c75fe3e0-4e5c-4975-bee9-e2c7bc386ea4/artifacts/v8yaahnm_ic2022_rv.csv'
}

def safe_float(val):
    """Convert to float, return None if invalid"""
    try:
        if pd.isna(val) or val == '.' or val == '':
            return None
        return float(val)
    except:
        return None

def safe_int(val):
    """Convert to int, return None if invalid"""
    try:
        if pd.isna(val) or val == '.' or val == '':
            return None
        return int(float(val))
    except:
        return None

def normalize_website(url):
    """Normalize website URL"""
    if pd.isna(url) or url == '' or url == '.':
        return None
    url = str(url).strip()
    if url and not url.startswith('http'):
        return f'https://{url}'
    return url if url else None

def safe_divide(numerator, denominator):
    """Safe division returning None if invalid"""
    num = safe_float(numerator)
    denom = safe_float(denominator)
    if num is not None and denom is not None and denom > 0:
        return round(num / denom, 4)
    return None

print("=" * 80)
print("IPEDS 2022 DATA ENGINE - BALANCED MERGE")
print("=" * 80)

# Step 1: Load all CSVs
print("\n[1/6] Loading CSV files...")
dfs = {}
for key, url in FILES.items():
    print(f"  Loading {key}...")
    dfs[key] = pd.read_csv(url, low_memory=False, encoding='latin-1')
    print(f"    ✓ {key}: {len(dfs[key])} rows, {len(dfs[key].columns)} columns")

# Step 2: Start with base file (hd2022.csv)
print("\n[2/6] Building base dataset from hd2022.csv...")
base = dfs['hd'].copy()
print(f"  Base institutions: {len(base)}")

# Step 3: Merge admissions data
print("\n[3/6] Merging admissions data (adm2022_rv.csv)...")
if 'UNITID' in dfs['adm'].columns:
    base = base.merge(dfs['adm'], on='UNITID', how='left', suffixes=('', '_adm'))
    print(f"  ✓ Merged: {len(base)} rows")
else:
    print("  ⚠ WARNING: UNITID not found in admissions file")

# Step 4: Merge enrollment/diversity data (with filtering and aggregation)
print("\n[4/6] Merging enrollment/diversity data (ef2022a_rv.csv)...")
ef_filtered = dfs['ef'].copy()
if 'EFALEVEL' in ef_filtered.columns:
    # Filter only undergraduate level
    ef_filtered = ef_filtered[ef_filtered['EFALEVEL'] == 1]
    print(f"  Filtered to EFALEVEL=1: {len(ef_filtered)} rows")
    
    # Define columns to aggregate
    race_cols = ['EFTOTLT', 'EFBKAAT', 'EFHISPT', 'EFWHITT', 'EFASIAT', 
                 'EFNHPIT', 'EFAIANT', 'EF2MORT', 'EFNRALT', 'EFUNKNT']
    
    # Find all gender columns (ending in M or W)
    all_ef_cols = [col for col in ef_filtered.columns if col.startswith('EF')]
    male_cols = [col for col in all_ef_cols if col.endswith('M')]
    female_cols = [col for col in all_ef_cols if col.endswith('W')]
    
    print(f"  Found {len(male_cols)} male columns and {len(female_cols)} female columns")
    
    # Prepare aggregation dictionary
    agg_dict = {}
    for col in race_cols:
        if col in ef_filtered.columns:
            agg_dict[col] = 'sum'
    for col in male_cols:
        if col in ef_filtered.columns:
            agg_dict[col] = 'sum'
    for col in female_cols:
        if col in ef_filtered.columns:
            agg_dict[col] = 'sum'
    
    # Group by UNITID and sum
    ef_aggregated = ef_filtered.groupby('UNITID', as_index=False).agg(agg_dict)
    print(f"  Aggregated to {len(ef_aggregated)} unique institutions")
    
    # Merge with base
    base = base.merge(ef_aggregated, on='UNITID', how='left', suffixes=('', '_ef'))
    print(f"  ✓ Merged: {len(base)} rows")
else:
    print("  ⚠ WARNING: EFALEVEL column not found")
    base = base.merge(ef_filtered, on='UNITID', how='left', suffixes=('', '_ef'))

# Step 5: Merge Pell data
print("\n[5/6] Merging Pell/Financial Aid data (sfa2122_rv.csv)...")
if 'UNITID' in dfs['sfa'].columns:
    base = base.merge(dfs['sfa'], on='UNITID', how='left', suffixes=('', '_sfa'))
    print(f"  ✓ Merged: {len(base)} rows")
else:
    print("  ⚠ WARNING: UNITID not found in SFA file")

# Step 6: Merge tuition/cost data
print("\n[6/6] Merging tuition/cost data (ic2022_ay.csv)...")
if 'UNITID' in dfs['ic_ay'].columns:
    base = base.merge(dfs['ic_ay'], on='UNITID', how='left', suffixes=('', '_ic'))
    print(f"  ✓ Merged: {len(base)} rows")
else:
    print("  ⚠ WARNING: UNITID not found in IC file")

# Step 7: Merge 4-year graduation data (with filtering)
print("\n[7/8] Merging 4-year graduation data (gr2022_rv.csv)...")
gr_filtered = dfs['gr'].copy()
if 'GRTYPE' in gr_filtered.columns and 'COHORT' in gr_filtered.columns:
    gr_filtered = gr_filtered[(gr_filtered['GRTYPE'] == 3) & (gr_filtered['COHORT'] == 2)]
    print(f"  Filtered graduation data: {len(gr_filtered)} rows")
    base = base.merge(gr_filtered, on='UNITID', how='left', suffixes=('', '_gr'))
    print(f"  ✓ Merged: {len(base)} rows")
else:
    print("  ⚠ WARNING: Required filter columns not found in gr2022")
    base = base.merge(gr_filtered, on='UNITID', how='left', suffixes=('', '_gr'))

# Step 8: Merge 6-year graduation data (with filtering)
print("\n[8/8] Merging 6-year graduation data (gr200_22_rv.csv)...")
gr200_filtered = dfs['gr200'].copy()
if 'GRTYPE' in gr200_filtered.columns and 'COHORT' in gr200_filtered.columns:
    gr200_filtered = gr200_filtered[(gr200_filtered['GRTYPE'] == 3) & (gr200_filtered['COHORT'] == 2)]
    print(f"  Filtered 6-year graduation data: {len(gr200_filtered)} rows")
    base = base.merge(gr200_filtered, on='UNITID', how='left', suffixes=('', '_gr200'))
    print(f"  ✓ Merged: {len(base)} rows")
else:
    print("  ⚠ WARNING: Required filter columns not found in gr200_22")
    base = base.merge(gr200_filtered, on='UNITID', how='left', suffixes=('', '_gr200'))

print(f"\n✓ All merges complete. Total rows: {len(base)}")
print(f"✓ Total columns: {len(base.columns)}")

# Step 9: Map fields to target schema
print("\n" + "=" * 80)
print("FIELD MAPPING & TRANSFORMATION")
print("=" * 80)

colleges = []
errors = []

for idx, row in base.iterrows():
    try:
        # Calculate acceptance rate
        acceptance_rate = safe_divide(row.get('ADMSSN'), row.get('APPLCN'))
        
        # SAT ranges
        sat_vr_25 = safe_int(row.get('SATVR25'))
        sat_mt_25 = safe_int(row.get('SATMT25'))
        sat_vr_75 = safe_int(row.get('SATVR75'))
        sat_mt_75 = safe_int(row.get('SATMT75'))
        
        sat_min = None
        sat_max = None
        if sat_vr_25 is not None and sat_mt_25 is not None:
            sat_min = sat_vr_25 + sat_mt_25
        if sat_vr_75 is not None and sat_mt_75 is not None:
            sat_max = sat_vr_75 + sat_mt_75
        
        # ACT ranges
        act_min = safe_int(row.get('ACTCM25'))
        act_max = safe_int(row.get('ACTCM75'))
        
        # Enrollment
        undergrad = safe_int(row.get('EFTOTLT'))
        
        # Race/Ethnicity percentages
        race_eth_pct = {}
        if undergrad and undergrad > 0:
            race_cols = {
                'black': 'EFBKAAT',
                'hispanic': 'EFHISPT',
                'white': 'EFWHITT',
                'asian': 'EFASIAT',
                'nativeHawaiian': 'EFNHPIT',
                'americanIndian': 'EFAIANT',
                'twoOrMore': 'EF2MORT',
                'nonResident': 'EFNRALT',
                'unknown': 'EFUNKNT'
            }
            for key, col in race_cols.items():
                val = safe_int(row.get(col))
                if val is not None:
                    race_eth_pct[key] = round(val / undergrad, 4)
        
        # Gender percentages
        gender_pct = {}
        if undergrad and undergrad > 0:
            # Sum all male columns
            male_cols = [col for col in base.columns if col.endswith('M') and col.startswith('EF')]
            male_total = sum([safe_int(row.get(col)) or 0 for col in male_cols])
            
            # Sum all female/women columns
            female_cols = [col for col in base.columns if col.endswith('W') and col.startswith('EF')]
            female_total = sum([safe_int(row.get(col)) or 0 for col in female_cols])
            
            if male_total > 0:
                gender_pct['male'] = round(male_total / undergrad, 4)
            if female_total > 0:
                gender_pct['female'] = round(female_total / undergrad, 4)
        
        # Pell percentage - find Pell column
        pell_pct = None
        pell_cols = [col for col in base.columns if 'PELL' in col.upper() and col not in ['NPELLF', 'NPELLM']]
        if pell_cols and undergrad and undergrad > 0:
            for pell_col in pell_cols:
                pell_recipients = safe_int(row.get(pell_col))
                if pell_recipients is not None:
                    pell_pct = round(pell_recipients / undergrad, 4)
                    break
        
        # Tuition and fees (ignore X-prefixed columns)
        tuition_in = safe_int(row.get('TUITION1'))
        tuition_out = safe_int(row.get('TUITION2'))
        fees_in = safe_int(row.get('FEE1'))
        fees_out = safe_int(row.get('FEE2'))
        avg_cost = safe_int(row.get('CHG1AY3'))
        
        # Graduation rates
        # 4-year: GRTOTLT from gr2022_rv / cohort size
        gr_4yr = None
        grtotlt_4yr = safe_int(row.get('GRTOTLT'))
        # Try to find cohort size column
        cohort_cols = [col for col in base.columns if 'CHRT' in col.upper() or 'COHORT' in col.upper()]
        if grtotlt_4yr is not None:
            for cohort_col in cohort_cols:
                cohort_size = safe_int(row.get(cohort_col))
                if cohort_size is not None and cohort_size > 0:
                    gr_4yr = round(grtotlt_4yr / cohort_size, 4)
                    break
        
        # 6-year: GRTOTLT from gr200_22_rv
        gr_6yr = None
        grtotlt_6yr = safe_int(row.get('GRTOTLT_gr200'))
        if grtotlt_6yr is not None:
            for cohort_col in cohort_cols:
                cohort_size = safe_int(row.get(cohort_col))
                if cohort_size is not None and cohort_size > 0:
                    gr_6yr = round(grtotlt_6yr / cohort_size, 4)
                    break
        
        college = {
            'ipedsId': str(row.get('UNITID')),
            'name': str(row.get('INSTNM', '')).strip() or None,
            'alias': str(row.get('IALIAS', '')).strip() or None,
            'website': normalize_website(row.get('WEBADDR')),
            'location': {
                'city': str(row.get('CITY', '')).strip() or None,
                'state': str(row.get('STABBR', '')).strip() or None,
                'zip': str(row.get('ZIP', '')).strip() or None,
                'locale': safe_int(row.get('LOCALE'))
            },
            'control': safe_int(row.get('CONTROL')),
            'sector': safe_int(row.get('SECTOR')),
            'admissions': {
                'acceptanceRate': acceptance_rate,
                'satRange': {
                    'min': sat_min,
                    'max': sat_max
                },
                'actRange': {
                    'min': act_min,
                    'max': act_max
                }
            },
            'enrollment': {
                'undergrad': undergrad
            },
            'diversity': {
                'raceEthnicityPct': race_eth_pct if race_eth_pct else {},
                'genderPct': gender_pct if gender_pct else {},
                'pellPct': pell_pct
            },
            'financials': {
                'tuitionInState': tuition_in,
                'tuitionOutOfState': tuition_out,
                'feesInState': fees_in,
                'feesOutOfState': fees_out,
                'avgCostAttendance': avg_cost
            },
            'outcomes': {
                'gradRate4yr': gr_4yr,
                'gradRate6yr': gr_6yr
            },
            'override': {},
            'staticSource': 'IPEDS_2022_revised',
            'lastStaticUpdate': datetime.utcnow().isoformat()
        }
        
        colleges.append(college)
        
    except Exception as e:
        errors.append({
            'unitid': row.get('UNITID'),
            'name': row.get('INSTNM'),
            'error': str(e)
        })

print(f"\n✓ Successfully mapped {len(colleges)} colleges")
if errors:
    print(f"⚠ Encountered {len(errors)} errors during mapping")

# Step 10: Save to JSON
print("\n" + "=" * 80)
print("OUTPUT GENERATION")
print("=" * 80)

output_file = '/app/colleges_final.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(colleges, f, indent=2, ensure_ascii=False)

print(f"\n✓ Output saved to: {output_file}")
print(f"✓ Total colleges in dataset: {len(colleges)}")

# Generate summary statistics
print("\n" + "=" * 80)
print("DATASET SUMMARY")
print("=" * 80)

# Count non-null values for key fields
stats = {
    'total_colleges': len(colleges),
    'with_acceptance_rate': sum(1 for c in colleges if c['admissions']['acceptanceRate'] is not None),
    'with_sat_scores': sum(1 for c in colleges if c['admissions']['satRange']['min'] is not None),
    'with_act_scores': sum(1 for c in colleges if c['admissions']['actRange']['min'] is not None),
    'with_enrollment': sum(1 for c in colleges if c['enrollment']['undergrad'] is not None),
    'with_tuition_data': sum(1 for c in colleges if c['financials']['tuitionInState'] is not None),
    'with_grad_rate_4yr': sum(1 for c in colleges if c['outcomes']['gradRate4yr'] is not None),
    'with_grad_rate_6yr': sum(1 for c in colleges if c['outcomes']['gradRate6yr'] is not None),
}

for key, value in stats.items():
    pct = (value / len(colleges) * 100) if len(colleges) > 0 else 0
    print(f"  {key}: {value} ({pct:.1f}%)")

print("\n" + "=" * 80)
print("✓ MERGE COMPLETE")
print("=" * 80)
print(f"\nOutput file ready: {output_file}")
print("Awaiting confirmation before MongoDB import...")
