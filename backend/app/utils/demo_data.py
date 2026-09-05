from typing import List, Dict, Any
from datetime import datetime

DEMO_COMPANIES: List[Dict[str, Any]] = [
    {
        "id": "comp_acme_cloud",
        "name": "Acme Cloud Tech",
        "normalized_name": "acmecloudtech",
        "website": "https://acmecloudtech.io",
        "industry": "SaaS",
        "location": "Bengaluru, India",
        "description": "Enterprise cloud automation & AI infrastructure platform for modern DevOps teams."
    },
    {
        "id": "comp_nexus_auto",
        "name": "Nexus Automation",
        "normalized_name": "nexusautomation",
        "website": "https://nexusauto.com",
        "industry": "SaaS",
        "location": "Austin, TX, USA",
        "description": "Workflow automation and intelligent process orchestration software."
    },
    {
        "id": "comp_datasphere",
        "name": "DataSphere Solutions",
        "normalized_name": "dataspheresolutions",
        "website": "https://datasphere.ai",
        "industry": "Data & Analytics",
        "location": "Mumbai, India",
        "description": "B2B data pipelines and real-time predictive analytics dashboard provider."
    },
    {
        "id": "comp_vanguard",
        "name": "Vanguard Digital",
        "normalized_name": "vanguarddigital",
        "website": "https://vanguarddigital.co.uk",
        "industry": "Enterprise IT",
        "location": "London, United Kingdom",
        "description": "Global enterprise cloud consulting, digital transformation, and legacy modernization."
    }
]

DEMO_RAW_RESEARCH: Dict[str, List[Dict[str, Any]]] = {
    "comp_acme_cloud": [
        {
            "attribute": "industry",
            "value": "SaaS",
            "source": "Official Company Website",
            "source_url": "https://acmecloudtech.io/about",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.95
        },
        {
            "attribute": "employee_count",
            "value": 450,
            "source": "Official Company Website",
            "source_url": "https://acmecloudtech.io/company",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.90
        },
        {
            "attribute": "employee_count",
            "value": 465,
            "source": "Reputable Financial Source",
            "source_url": "https://crunchbase.com/organization/acme-cloud",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.85
        },
        {
            "attribute": "employee_count",
            "value": 460,
            "source": "Government / Regulatory Filing",
            "source_url": "https://mca.gov.in/filings/acme-cloud",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 1.00
        },
        {
            "attribute": "revenue_millions",
            "value": 25.0,
            "source": "Reputable Financial Source",
            "source_url": "https://techcrunch.com/acme-cloud-funding",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.85
        },
        {
            "attribute": "technologies",
            "value": ["Cloud", "AI", "Automation", "Kubernetes", "AWS"],
            "source": "Job Posting",
            "source_url": "https://acmecloudtech.io/careers",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.80
        },
        {
            "attribute": "growth_signals",
            "value": ["Recent Expansion", "Series B Funding ($15M)", "International Office Launch"],
            "source": "Major News Source",
            "source_url": "https://economictimes.com/news/acme-expansion",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.85
        },
        {
            "attribute": "hiring_signals",
            "value": ["Active Hiring", "Engineering Hiring", "VP Sales Search"],
            "source": "Job Posting",
            "source_url": "https://linkedin.com/company/acme-cloud/jobs",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.90
        }
    ],
    "comp_nexus_auto": [
        {
            "attribute": "industry",
            "value": "SaaS",
            "source": "Official Company Website",
            "source_url": "https://nexusauto.com",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.90
        },
        {
            "attribute": "employee_count",
            "value": 220,
            "source": "Official Company Website",
            "source_url": "https://nexusauto.com/about",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.90
        },
        {
            "attribute": "revenue_millions",
            "value": 18.0,
            "source": "Official Company Website",
            "source_url": "https://nexusauto.com/press",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.85
        },
        {
            "attribute": "revenue_millions",
            "value": 20.0,
            "source": "Reputable Financial Source",
            "source_url": "https://forbes.com/nexus-auto",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.80
        },
        {
            "attribute": "revenue_millions",
            "value": 95.0,  # Outlying conflict source!
            "source": "Third-Party Directory",
            "source_url": "https://unverified-directory.com/nexus",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.40
        },
        {
            "attribute": "technologies",
            "value": ["AI", "Cloud", "Python", "React"],
            "source": "Job Posting",
            "source_url": "https://nexusauto.com/jobs",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.75
        },
        {
            "attribute": "growth_signals",
            "value": ["Regional Expansion"],
            "source": "Major News Source",
            "source_url": "https://techcrunch.com/nexus-auto-expansion",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.75
        },
        {
            "attribute": "hiring_signals",
            "value": ["Engineering Hiring"],
            "source": "Job Posting",
            "source_url": "https://linkedin.com/company/nexus-auto/jobs",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.80
        }
    ],
    "comp_datasphere": [
        {
            "attribute": "industry",
            "value": "Data & Analytics",
            "source": "Official Company Website",
            "source_url": "https://datasphere.ai",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.90
        },
        {
            "attribute": "employee_count",
            "value": 75,
            "source": "Third-Party Directory",
            "source_url": "https://zoominfo.com/p/datasphere",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.60
        },
        {
            "attribute": "revenue_millions",
            "value": 6.0,
            "source": "Third-Party Directory",
            "source_url": "https://zoominfo.com/p/datasphere",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.50
        },
        {
            "attribute": "technologies",
            "value": ["Cloud", "Automation", "Snowflake"],
            "source": "Official Company Website",
            "source_url": "https://datasphere.ai/tech",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.85
        }
    ],
    "comp_vanguard": [
        {
            "attribute": "industry",
            "value": "Enterprise IT",
            "source": "Official Company Website",
            "source_url": "https://vanguarddigital.co.uk",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.95
        },
        {
            "attribute": "employee_count",
            "value": 1200,
            "source": "Government / Regulatory Filing",
            "source_url": "https://companieshouse.gov.uk/vanguard",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 1.00
        },
        {
            "attribute": "revenue_millions",
            "value": 120.0,
            "source": "Government / Regulatory Filing",
            "source_url": "https://companieshouse.gov.uk/vanguard",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 1.00
        },
        {
            "attribute": "technologies",
            "value": ["Cloud", "Java", "Azure"],
            "source": "Job Posting",
            "source_url": "https://vanguarddigital.co.uk/careers",
            "timestamp": datetime.utcnow().isoformat(),
            "extraction_method": "Demo Provider",
            "confidence": 0.70
        }
    ]
}
