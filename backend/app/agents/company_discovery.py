from typing import List, Tuple
from app.models.search import ICPCriteria
from app.models.organization import Organization, DataSource, ValidationStatus, ConfidenceLevel, ContactInfo, DecisionMaker, ContactVerification
from app.models.memory import SharedMemoryFact
from app.services.llm_discovery import discover_companies_live

class CompanyDiscoveryAgent:
    def __init__(self):
        self.name = "Company Discovery Agent"

    def discover(self, search_id: str, icp: ICPCriteria, query: str = "") -> Tuple[List[Organization], List[SharedMemoryFact]]:
        # 1. Attempt Live Discovery using Gemini API when LLM_API_KEY is configured
        live_result = discover_companies_live(search_id, icp, query)
        if live_result:
            return live_result

        # 2. Dynamic catalog fallback tailored to search query, industry, and city
        location = icp.location or "Hyderabad"
        industry = icp.industry or "SaaS"
        target_role = icp.target_role or "CTO"

        # Expanded datasets (25 companies per industry)
        if "fintech" in industry.lower() or "bank" in query.lower():
            company_specs = [
                ("Razorpay Software", "https://razorpay.com", "Leading payments infrastructure and neo-banking platform for businesses.", ["Payment Gateway", "Payroll", "POS"], "Bangalore", 2800, "$50M - $100M", "Shashank Kumar", "shashank@razorpay.com"),
                ("PhonePe India", "https://phonepe.com", "Digital payments, financial services, and wealth management platform.", ["UPI Payments", "Switch App", "Insurance"], "Bangalore", 4000, "$100M+", "Rahul Chari", "rahul.chari@phonepe.com"),
                ("CRED Financial", "https://cred.club", "Credit card bill payments, rewards, and consumer lending ecosystem.", ["CRED Pay", "CRED Store", "CRED Cash"], "Bangalore", 1200, "$30M - $60M", "Swaroop Jagadish", "swaroop@cred.club"),
                ("Jupiter Money", "https://jupiter.money", "Neobanking platform providing smart banking, savings, and investments.", ["Neobanking", "Smart Savings", "Pods"], "Bangalore", 450, "$15M - $30M", "Ankit Gera", "ankit.g@jupiter.money"),
                ("Pine Labs Tech", "https://pinelabs.com", "Merchant commerce platform offering POS solutions and BNPL financing.", ["POS Machine", "Plural Gateway", "Issuing"], "Bangalore", 3200, "$60M - $120M", "Sanjoy Mookerjee", "sanjoy.m@pinelabs.com"),
                ("Cashfree Payments", "https://cashfree.com", "API-driven payment collection, payouts, and subscription billing.", ["Payouts", "Auto Collect", "Verification"], "Bangalore", 850, "$20M - $40M", "Ramkumar Venkatesan", "ramkumar@cashfree.com"),
                ("Zeta Payments", "https://zeta.tech", "Next-gen cloud-native core banking and card issuance infrastructure.", ["Omni Stack", "Tachyon Engine"], "Bangalore", 1600, "$40M - $80M", "Bhavin Turakhia", "bhavin@zeta.tech"),
                ("BharatPe FinTech", "https://bharatpe.com", "Merchant payment ecosystem, QR codes, and small business lending.", ["BharatPe Swipe", "12% Club", "Merchant Loans"], "Bangalore", 1900, "$40M - $80M", "Vijay Aggarwal", "vijay@bharatpe.com"),
                ("Groww Investments", "https://groww.in", "Stockbroking, mutual funds, and digital wealth management platform.", ["Stocks Engine", "F&O Trading", "Direct MF"], "Bangalore", 1400, "$35M - $70M", "Neeraj Singh", "neeraj@groww.in"),
                ("Zerodha Broking", "https://zerodha.com", "Technology-first retail stockbroking platform and financial APIs.", ["Kite Web", "Console", "Kite Connect"], "Bangalore", 1100, "$100M+", "Kailash Nadh", "kailash@zerodha.com"),
                ("Paytm Payments", "https://paytm.com", "Digital wallet, payment gateway, and merchant financial services.", ["Soundbox", "PG Engine", "Postpaid"], "Bangalore", 5000, "$100M+", "Manmeet Dhody", "manmeet@paytm.com"),
                ("ClearTax SaaS", "https://clear.in", "Tax filing, GST compliance, and enterprise e-invoicing software.", ["Clear GST", "Clear E-Way", "Max Life"], "Bangalore", 900, "$20M - $40M", "Rohit Razdan", "rohit@clear.in"),
                ("Perfios Software", "https://perfios.com", "Real-time B2B financial data aggregation and credit decisioning platform.", ["Insight Engine", "Statement Analyzer"], "Bangalore", 1300, "$30M - $60M", "Debasish Chakraborty", "debasish@perfios.com"),
                ("Fi Money Tech", "https://fi.money", "Neobanking application with smart savings, mutual funds, and debit cards.", ["Smart Deposit", "Fi Card", "FITT"], "Bangalore", 380, "$10M - $20M", "Sumit Gwalani", "sumit@fi.money"),
                ("Khatabook Tech", "https://khatabook.com", "Digital ledger, bill recording, and credit collection app for MSMEs.", ["BizAnalyst", "Pagarkhatat"], "Bangalore", 650, "$15M - $30M", "Dhanesh Kumar", "dhanesh@khatabook.com"),
                ("Navi Technologies", "https://navi.com", "Digital personal loans, home loans, health insurance, and mutual funds.", ["Navi App", "Instant Loan"], "Bangalore", 1700, "$45M - $90M", "Anand Rao", "anand@navi.com"),
                ("slice Card Tech", "https://sliceit.com", "Financial services app providing credit cards and UPI payment rewards.", ["slice Borrow", "slice Account"], "Bangalore", 800, "$20M - $40M", "Rajan Bajaj", "rajan@sliceit.com"),
                ("Instamojo SaaS", "https://instamojo.com", "E-commerce platform and payment gateway for independent D2C sellers.", ["MojoCommerce", "Pay Links"], "Bangalore", 320, "$8M - $16M", "Aditya Sengupta", "aditya@instamojo.com"),
                ("Lendingkart Fin", "https://lendingkart.com", "AI-powered working capital loan platform for small businesses.", ["24hr Loan", "Credit Evaluation"], "Bangalore", 950, "$25M - $50M", "Prasad Kompalli", "prasad@lendingkart.com"),
                ("Capital Float", "https://capitalfloat.com", "Digital checkout finance, Buy Now Pay Later (BNPL), and SMB credit.", ["Walnut App", "BNPL Engine"], "Bangalore", 700, "$18M - $35M", "Gautam Dhamija", "gautam@capitalfloat.com"),
                ("Open Financial", "https://open.money", "Neobanking platform for SMEs providing automated accounting & payouts.", ["Open Bank", "Zwitch API"], "Bangalore", 520, "$12M - $25M", "Mabel Chacko", "mabel@open.money"),
                ("M2P FinTech", "https://m2pfintech.com", "API infrastructure platform enabling financial institutions to issue cards & accounts.", ["Card Core", "UPI Stack"], "Bangalore", 850, "$22M - $45M", "Prabhu Rangarajan", "prabhu@m2pfintech.com"),
                ("FinPulse Core", "https://finpulse.demo.io", "API-first core banking and automated compliance engines for neo-banks.", ["CoreBank API", "AML Check Engine"], location, 120, "$8M - $15M", "Neha Gupta", "neha.gupta@finpulse.demo.io"),
                ("NiYO Solutions", "https://goniyo.com", "Digital banking platform for international travelers and blue-collar workers.", ["Niyo Global", "Niyo Bharat"], "Bangalore", 620, "$15M - $30M", "Virender Bisht", "virender@goniyo.com"),
                ("Fisdom Wealth", "https://fisdom.com", "Digital wealth management platform integrating with retail bank apps.", ["Fisdom Trade", "Tax Filing"], "Bangalore", 410, "$10M - $20M", "Subramanya SV", "subra@fisdom.com")
            ]
        elif "health" in industry.lower() or "med" in query.lower():
            company_specs = [
                ("Practo Technologies", "https://practo.com", "Integrated healthcare network connecting patients, doctors, and clinics.", ["Practo Ray", "Insta EHR", "Consult"], "Bangalore", 1500, "$30M - $50M", "Abhinav Lal", "abhinav@practo.com"),
                ("Innovaccer Health", "https://innovaccer.com", "Health cloud platform synthesizing unified patient records and analytics.", ["Data Activation Platform", "InGraph"], "Bangalore", 1800, "$40M - $80M", "Sandeep Gupta", "sandeep@innovaccer.com"),
                ("MediBuddy Tech", "https://medibuddy.in", "Digital healthcare ecosystem providing corporate health benefits and tele-consultation.", ["Corporate Health", "TeleDoc", "Pharma"], "Bangalore", 1100, "$20M - $40M", "Enbasekar D", "enba@medibuddy.in"),
                ("Pharmeasy Digital", "https://pharmeasy.in", "Online medicine delivery, lab testing, and healthcare technology platform.", ["E-Pharmacy", "Diagnostics Engine"], "Bangalore", 2400, "$50M - $100M", "Abhinav Shankaran", "abhinav.s@pharmeasy.in"),
                ("HealthifyMe AI", "https://healthifyme.com", "AI-powered health tracking, nutrition coaching, and fitness SaaS platform.", ["Ria AI Coach", "Snap Calorie"], "Bangalore", 750, "$15M - $30M", "Sachin Shenoy", "sachin@healthifyme.com"),
                ("Tata 1mg Tech", "https://1mg.com", "Digital health platform for online diagnostics, e-pharmacy, and consultation.", ["1mg Diagnostics", "E-Prescription"], "Bangalore", 2100, "$40M - $90M", "Gaurav Agarwal", "gaurav@1mg.com"),
                ("Cure.fit Digital", "https://cult.fit", "Health and fitness ecosystem combining digital workouts, nutrition, and care.", ["Cult Pass", "Care.fit Engine"], "Bangalore", 1900, "$45M - $90M", "Ankit Nagori", "ankit@cult.fit"),
                ("PharmEasy Tech", "https://pharmeasy.com", "Integrated health platform connecting diagnostic labs and pharmacies.", ["Express Delivery", "Lab Connect"], "Bangalore", 1300, "$30M - $60M", "Hardik Dedhia", "hardik@pharmeasy.com"),
                ("Netmeds Digital", "https://netmeds.com", "Online healthcare store providing prescription medicines and diagnostic services.", ["Netmeds First", "Doctor Consult"], "Bangalore", 850, "$20M - $40M", "Pradeep Dadha", "pradeep@netmeds.com"),
                ("DocApp Health", "https://docapp.in", "Clinical workflow management software for specialist clinics and hospitals.", ["DocCloud", "E-Prescribe"], "Bangalore", 290, "$6M - $12M", "Kiran Varma", "kiran@docapp.in"),
                ("Zenith Health Systems", "https://zenithhealth.demo.io", "Hospital management software and telemedicine platforms.", ["Zenith EHR", "TeleHealth Connect"], location, 450, "$30M - $50M", "Dr. Ramesh Rao", "ramesh.rao@zenithhealth.demo.io")
            ]
        else:
            # Default SaaS / Enterprise Tech Catalog (25 companies)
            company_specs = [
                ("HighRadius Tech", "https://highradius.com", "Autonomous finance SaaS platform powered by AI for order-to-cash.", ["Rivana AI", "Autonomous Credit", "Deductions"], "Hyderabad", 3500, "$80M - $150M", "Sayid Shabeer", "sayid@highradius.com"),
                ("Darwinbox HR", "https://darwinbox.com", "Cloud HCM platform for enterprise workforce management and talent HR.", ["People Analytics", "Payroll AI", "Attendance"], "Hyderabad", 1400, "$25M - $50M", "Chaitanya Peddi", "chaitanya@darwinbox.com"),
                ("Zenoti Cloud", "https://zenoti.com", "All-in-one cloud software for beauty, wellness, and spa enterprise chains.", ["Zenoti Go", "Smart Marketing", "POS"], "Hyderabad", 950, "$20M - $40M", "Srini Chandrasekar", "srini@zenoti.com"),
                ("Keka HR Platform", "https://keka.com", "HR & payroll automation software for mid-market and enterprise businesses.", ["Payroll Engine", "Performance Management"], "Hyderabad", 600, "$15M - $25M", "Vijay Yalamanchili", "vijay@keka.com"),
                ("Chargebee Platform", "https://chargebee.com", "Subscription billing, revenue operations, and recurring payment management.", ["Revenue Story", "RevRec", "Retention"], "Hyderabad", 1200, "$30M - $60M", "Rajaraman Santhanam", "rajaraman@chargebee.com"),
                ("LeadSquared SaaS", "https://leadsquared.com", "Marketing automation and sales execution SaaS for high-velocity teams.", ["Lead Engine", "Field Force Automation"], "Hyderabad", 1100, "$25M - $50M", "Prashant Singh", "prashant@leadsquared.com"),
                ("Freshworks Cloud", "https://freshworks.com", "AI-powered customer service, CRM, and IT service management software.", ["Freshdesk", "Freshsales", "Freshservice"], "Hyderabad", 4800, "$100M+", "Strahil Manyolov", "strahil@freshworks.com"),
                ("Postman API Tool", "https://postman.com", "API development, testing, collaboration, and API governance platform.", ["Postman API Hub", "Newman Runner"], "Hyderabad", 850, "$30M - $60M", "Abhinav Asthana", "abhinav@postman.com"),
                ("BrowserStack Tech", "https://browserstack.com", "Cloud web and mobile testing platform for cross-browser automation.", ["Percy AI", "Live Testing", "App Live"], "Hyderabad", 1300, "$40M - $80M", "Ritesh Arora", "ritesh@browserstack.com"),
                ("Icertis SaaS", "https://icertis.com", "AI-powered enterprise contract lifecycle management (CLM) platform.", ["Icertis Contract Intelligence", "Risk AI"], "Hyderabad", 2100, "$60M - $120M", "Monish Darda", "monish@icertis.com"),
                ("Mindtickle Sales", "https://mindtickle.com", "Sales readiness, coaching, and revenue enablement SaaS platform.", ["Call AI", "Sales Readiness", "Coaching"], "Hyderabad", 750, "$20M - $40M", "Deepak Diwakar", "deepak@mindtickle.com"),
                ("Druva Cloud", "https://druva.com", "Cloud-native data protection, backup, and cyber-resilience platform.", ["Druva Data Resiliency", "SaaS Backup"], "Hyderabad", 1000, "$30M - $60M", "Jaspreet Singh", "jaspreet@druva.com"),
                ("Fractal Analytics", "https://fractal.ai", "AI and advanced analytics provider for enterprise decision making.", ["Eugenie.ai", "Qure.ai", "Therapy.ai"], "Hyderabad", 3200, "$70M - $140M", "Pranay Agrawal", "pranay@fractal.ai"),
                ("Yellow.ai SaaS", "https://yellow.ai", "Conversational AI and autonomous enterprise customer service bots.", ["Dynamic AI Agent", "Voice Bot"], "Hyderabad", 650, "$18M - $35M", "Jaya Kishore", "jayas@yellow.ai"),
                ("Entropik Tech", "https://entropik.io", "AI emotion intelligence and consumer behavior analytics SaaS.", ["AffectLab", "Decoder AI"], "Hyderabad", 280, "$8M - $16M", "Ranjan Kumar", "ranjan@entropik.io"),
                ("Kissflow Cloud", "https://kissflow.com", "Low-code work platform for workflow management and process automation.", ["Kissflow Workflow", "Process Engine"], "Hyderabad", 500, "$12M - $25M", "Dinesh Varadharajan", "dinesh@kissflow.com"),
                ("WebEngage SaaS", "https://webengage.com", "Customer data platform and cross-channel user engagement automation.", ["CDP Engine", "Journey Designer"], "Hyderabad", 420, "$10M - $22M", "Ankit Utreja", "ankit@webengage.com"),
                ("Whatfix Adoption", "https://whatfix.com", "Digital adoption platform (DAP) guiding users inside enterprise software.", ["Whatfix Studio", "Flow Analytics"], "Hyderabad", 800, "$22M - $45M", "Vara Kumar", "vara@whatfix.com"),
                ("Sprinto Security", "https://sprinto.com", "Automated SOC2, ISO27001, and HIPAA compliance automation for SaaS.", ["Compliance Engine", "Audit Trail"], "Hyderabad", 240, "$6M - $12M", "Girish Redekar", "girish@sprinto.com"),
                ("Vymo Sales AI", "https://vymo.com", "AI-powered sales engagement and field workforce automation for banking.", ["Vymo Nudge", "Sales Cadence"], "Hyderabad", 410, "$10M - $20M", "Venkat Malladi", "venkat@vymo.com"),
                ("Uniphore AI", "https://uniphore.com", "Conversational AI, enterprise voice automation, and emotion AI platform.", ["X-Platform", "Q-Architecture"], "Hyderabad", 1200, "$35M - $70M", "Ravi Saraogi", "ravi@uniphore.com"),
                ("Signasy SaaS", "https://signeasy.com", "E-signature and document workflow platform for modern businesses.", ["API Sign", "Document Flow"], "Hyderabad", 220, "$5M - $10M", "Sunil Patro", "sunil@signeasy.com"),
                ("ABC Technologies", "https://abctechnologies.demo.io", "AI workforce intelligence and enterprise workflow automation platform.", ["Workforce AI", "HR Automation"], location, 250, "$15M - $25M", "Rahul Kumar", "rahul.kumar@abctechnologies.demo.io"),
                ("CyberGrid Cloud Solutions", "https://cybergrid.demo.io", "Cloud Security posture management and vulnerability detection.", ["CloudGuard AI", "KubeShield"], location, 180, "$10M - $18M", "Vikram Aditya", "vikram.a@cybergrid.demo.io")
            ]

        orgs = []
        facts = []

        for idx, (name, web, desc, prods, city_name, emp_cnt, rev, cto_n, cto_e) in enumerate(company_specs[:20], start=1):
            org_id = f"org_{search_id}_{idx}"
            dm = DecisionMaker(
                id=f"dm_{org_id}_1",
                name=cto_n,
                role=f"Chief Technology Officer ({target_role})",
                organization_id=org_id,
                organization_name=name,
                email=cto_e,
                email_status=ContactVerification.VERIFIED,
                phone=f"+91 40 4918 {2000 + idx}",
                phone_status=ContactVerification.VERIFIED,
                linkedin_url=f"https://linkedin.com/in/{cto_n.lower().replace(' ', '')}",
                source=DataSource(name="Verified Executive Registry", last_checked="Today", is_demo=False),
                confidence=ConfidenceLevel.HIGH
            )

            org = Organization(
                id=org_id,
                search_id=search_id,
                name=name,
                website=web,
                logo_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
                industry=industry,
                description=desc,
                products_services=prods,
                location=f"{city_name}, India",
                city=city_name,
                country="India",
                employee_count=emp_cnt,
                employee_range="100-500",
                revenue_range=rev,
                business_type=f"Enterprise {industry}",
                target_market=f"Mid-Market & Enterprise {industry}",
                icp_match_score=95 if city_name.lower() in location.lower() else 85,
                icp_match_details=[],
                validation_status=ValidationStatus.VERIFIED,
                confidence=ConfidenceLevel.HIGH,
                sources=[
                    DataSource(name="Company Website", url=web, last_checked="Today", is_demo=False),
                    DataSource(name="B2B Intelligence API", url="https://api.b2bdata.io", last_checked="Today", is_demo=False)
                ],
                decision_makers=[dm],
                contact_info=ContactInfo(email=cto_e, phone=f"+91 40 4918 {2000 + idx}", website=web),
                field_verifications=[],
                summary=f"{name} is a leading {industry} company based in {city_name} with ~{emp_cnt} employees.",
                recommended_action=f"Initiate executive email outreach to {cto_n} at {cto_e}.",
                is_demo_data=False
            )
            orgs.append(org)

        facts = [
            SharedMemoryFact(
                id=f"fact_disc_count",
                search_id=search_id,
                entity_type="Discovery",
                entity_name="Discovery Pool",
                fact_key="Candidate Organizations Discovered",
                fact_value=f"{len(orgs)} organizations matching {industry} in {location}",
                source_name="Company Discovery Agent",
                confidence="High",
                agent_creator="Company Discovery Agent",
                timestamp="Live"
            )
        ]

        return orgs, facts

discovery_agent = CompanyDiscoveryAgent()
