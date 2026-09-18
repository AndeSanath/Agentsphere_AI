import os
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_deloitte_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # --- Palette ---
    DARK_BG = RGBColor(0x1C, 0x1E, 0x22)          # Deep Obsidian
    DARK_SURFACE = RGBColor(0x28, 0x2A, 0x2F)     # Elevated Dark Card
    LIGHT_BG = RGBColor(0xF7, 0xF6, 0xF2)         # Off-White Clean
    CARD_BG = RGBColor(0xEB, 0xE8, 0xDF)          # Warm Neutral Card
    WHITE_CARD = RGBColor(0xFF, 0xFF, 0xFD)       # White Island
    
    BORDER_DARK = RGBColor(0x28, 0x2A, 0x2F)      # Dark Border
    BORDER_LIGHT = RGBColor(0xD2, 0xCF, 0xC4)     # Subtle Border
    
    EMERALD_DEEP = RGBColor(0x2E, 0x47, 0x3B)     # Deep Forest Green Accent
    EMERALD_ACCENT = RGBColor(0x45, 0x6E, 0x5B)   # Bright Moss Accent
    RED_ACCENT = RGBColor(0x8A, 0x3C, 0x34)       # Subtle Warning Red for Existing
    
    TEXT_LIGHT_PRIMARY = RGBColor(0xF3, 0xF2, 0xEC)
    TEXT_LIGHT_MUTED = RGBColor(0xB5, 0xB3, 0xA7)
    TEXT_DARK_PRIMARY = RGBColor(0x1F, 0x20, 0x24)
    TEXT_DARK_MUTED = RGBColor(0x5E, 0x60, 0x5B)

    FONT_TITLE = "Playfair Display"
    FONT_BODY = "Public Sans"
    FONT_BOLD = "Public Sans Bold"

    def set_slide_bg(slide, color):
        fill = slide.background.fill
        fill.solid()
        fill.fore_color.rgb = color

    def add_header(slide, title_text, category_tag="AGENTSPHERE AI", dark=False):
        tb_tag = slide.shapes.add_textbox(Inches(0.6), Inches(0.35), Inches(8.0), Inches(0.25))
        p_tag = tb_tag.text_frame.paragraphs[0]
        p_tag.text = category_tag.upper()
        p_tag.font.name = FONT_BOLD
        p_tag.font.size = Pt(9)
        p_tag.font.bold = True
        p_tag.font.color.rgb = EMERALD_ACCENT if dark else EMERALD_DEEP

        tb_title = slide.shapes.add_textbox(Inches(0.6), Inches(0.55), Inches(12.13), Inches(0.45))
        p_title = tb_title.text_frame.paragraphs[0]
        p_title.text = title_text
        p_title.font.name = FONT_TITLE
        p_title.font.size = Pt(20)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_LIGHT_PRIMARY if dark else TEXT_DARK_PRIMARY

        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(1.02), Inches(12.13), Inches(0.012))
        line.fill.solid()
        line.fill.fore_color.rgb = RGBColor(0x40, 0x43, 0x4A) if dark else BORDER_LIGHT
        line.line.color.rgb = RGBColor(0x40, 0x43, 0x4A) if dark else BORDER_LIGHT

    # =========================================================================
    # SLIDE 1: HERO TITLE SLIDE (Deloitte Capstone Project)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s1, DARK_BG)

    # Top Tag
    tb = s1.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.7), Inches(0.3))
    p = tb.text_frame.paragraphs[0]
    p.text = "DELOITTE CAPSTONE PROJECT"
    p.font.name = FONT_BOLD
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = EMERALD_ACCENT

    # Main Title
    tb = s1.shapes.add_textbox(Inches(0.8), Inches(1.2), Inches(11.7), Inches(1.2))
    p = tb.text_frame.paragraphs[0]
    p.text = "AgentSphere AI"
    p.font.name = FONT_TITLE
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = TEXT_LIGHT_PRIMARY

    # Subtitle
    tb = s1.shapes.add_textbox(Inches(0.8), Inches(2.45), Inches(11.7), Inches(0.6))
    p = tb.text_frame.paragraphs[0]
    p.text = "Autonomous Multi-Agent Intelligence for B2B Customer Discovery & Prospect Intelligence"
    p.font.name = FONT_BODY
    p.font.size = Pt(16)
    p.font.color.rgb = TEXT_LIGHT_MUTED

    # Divider
    line = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(3.35), Inches(11.73), Inches(0.015))
    line.fill.solid()
    line.fill.fore_color.rgb = RGBColor(0x3B, 0x3E, 0x45)
    line.line.color.rgb = RGBColor(0x3B, 0x3E, 0x45)

    # Team Leader Card (Left)
    leader_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.7), Inches(3.6), Inches(2.8))
    leader_card.fill.solid()
    leader_card.fill.fore_color.rgb = DARK_SURFACE
    leader_card.line.color.rgb = RGBColor(0x38, 0x3B, 0x42)
    
    tb = s1.shapes.add_textbox(Inches(1.05), Inches(3.95), Inches(3.1), Inches(2.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "TEAM LEADER"
    p.font.name = FONT_BOLD
    p.font.size = Pt(10)
    p.font.color.rgb = EMERALD_ACCENT
    p.space_after = Pt(6)
    
    p = tf.add_paragraph()
    p.text = "Shiva Chandhan"
    p.font.name = FONT_TITLE
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = TEXT_LIGHT_PRIMARY
    p.space_after = Pt(14)

    p = tf.add_paragraph()
    p.text = "DOMAIN FOCUS"
    p.font.name = FONT_BOLD
    p.font.size = Pt(10)
    p.font.color.rgb = EMERALD_ACCENT
    p.space_after = Pt(4)

    p = tf.add_paragraph()
    p.text = "Multi-Agent AI Systems\nAutonomous B2B Intelligence"
    p.font.name = FONT_BODY
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_LIGHT_MUTED

    # Team Members Card (Right)
    team_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.7), Inches(3.7), Inches(7.83), Inches(2.8))
    team_card.fill.solid()
    team_card.fill.fore_color.rgb = DARK_SURFACE
    team_card.line.color.rgb = RGBColor(0x38, 0x3B, 0x42)

    tb = s1.shapes.add_textbox(Inches(5.0), Inches(3.95), Inches(7.2), Inches(0.35))
    p = tb.text_frame.paragraphs[0]
    p.text = "PROJECT CONTRIBUTORS"
    p.font.name = FONT_BOLD
    p.font.size = Pt(10)
    p.font.color.rgb = EMERALD_ACCENT

    team_members = ["Shiva Chandhan", "Sanath", "Umesh", "Sathwik", "Varshanth"]
    for idx, name in enumerate(team_members):
        col_x = Inches(5.0) if idx < 3 else Inches(8.8)
        row_y = Inches(4.45) + (idx % 3) * Inches(0.65)
        
        m_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col_x, row_y, Inches(3.5), Inches(0.55))
        m_box.fill.solid()
        m_box.fill.fore_color.rgb = RGBColor(0x20, 0x22, 0x26)
        m_box.line.color.rgb = RGBColor(0x33, 0x36, 0x3C)
        
        tb = s1.shapes.add_textbox(col_x + Inches(0.15), row_y + Inches(0.08), Inches(3.2), Inches(0.4))
        p1 = tb.text_frame.paragraphs[0]
        p1.text = name
        p1.font.name = FONT_BOLD
        p1.font.size = Pt(12)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_LIGHT_PRIMARY

    # =========================================================================
    # SLIDE 2: PROBLEM STATEMENT (Clean, Simple, Punchy)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s2, LIGHT_BG)
    add_header(s2, "The Core Problem in B2B Customer Discovery", category_tag="PROBLEM STATEMENT")

    # Left Hero Problem Statement Banner
    left_banner = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(1.2), Inches(4.6), Inches(5.6))
    left_banner.fill.solid()
    left_banner.fill.fore_color.rgb = DARK_BG
    left_banner.line.color.rgb = BORDER_DARK

    tb = s2.shapes.add_textbox(Inches(0.9), Inches(1.5), Inches(4.0), Inches(5.0))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = "THE CORE CHALLENGE"
    p.font.name = FONT_BOLD
    p.font.size = Pt(10)
    p.font.color.rgb = EMERALD_ACCENT
    p.space_after = Pt(10)

    p = tf.add_paragraph()
    p.text = "Sales & strategy teams lose up to 70% of their prospecting time to manual, fragmented, and unverified data gathering."
    p.font.name = FONT_TITLE
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = TEXT_LIGHT_PRIMARY
    p.space_after = Pt(16)

    p = tf.add_paragraph()
    p.text = "Current AI tools hallucinate non-existent companies or rely on static, outdated databases without validating live web ground truth or evaluating dynamic Ideal Customer Profiles (ICPs)."
    p.font.name = FONT_BODY
    p.font.size = Pt(11.5)
    p.font.color.rgb = TEXT_LIGHT_MUTED

    # Right 3 Friction Points
    friction_points = [
        ("01", "Manual Research Latency & High Overhead",
         "Manually browsing company websites, search results, and LinkedIn profiles is tedious, expensive, and unscalable for modern enterprise growth."),
        ("02", "Hallucinated Signals & Rapid Data Decay",
         "Generic single-prompt LLMs invent executive contacts and company offerings, while static databases suffer from high bounce rates and stale records."),
        ("03", "Rigid Keyword Filtering vs. Semantic ICP Fit",
         "Traditional search engines and legacy CRMs rely on rigid keyword filters rather than dynamically evaluating complex multi-dimensional criteria.")
    ]

    for idx, (num, title, desc) in enumerate(friction_points):
        card_top = Inches(1.2) + idx * Inches(1.9)
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.4), card_top, Inches(7.33), Inches(1.75))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_DARK
        card.line.width = Pt(1.1)

        pill = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.65), card_top + Inches(0.25), Inches(0.65), Inches(0.35))
        pill.fill.solid()
        pill.fill.fore_color.rgb = EMERALD_DEEP
        pill.line.color.rgb = BORDER_DARK
        pill_p = pill.text_frame.paragraphs[0]
        pill_p.text = num
        pill_p.font.name = FONT_BOLD
        pill_p.font.size = Pt(10)
        pill_p.font.bold = True
        pill_p.font.color.rgb = TEXT_LIGHT_PRIMARY
        pill_p.alignment = PP_ALIGN.CENTER

        tb = s2.shapes.add_textbox(Inches(6.45), card_top + Inches(0.18), Inches(6.1), Inches(1.4))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.name = FONT_BOLD
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_DARK_PRIMARY
        p1.space_after = Pt(4)

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = FONT_BODY
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = TEXT_DARK_MUTED

    # =========================================================================
    # SLIDE 3: EXISTING SOLUTIONS VS AGENTSPHERE AI (INDUSTRY BENCHMARK)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s3, LIGHT_BG)
    add_header(s3, "Industry Existing Solutions vs. AgentSphere AI", category_tag="COMPETITIVE LANDSCAPE & INDUSTRY DIFFERENTIATION")

    comparisons = [
        ("Static B2B Databases\n(ZoomInfo, Apollo, Lusha)",
         "Relies on stale cached snapshots (30%+ annual decay); rigid boolean filters and frequent bounce rates with zero live verification.",
         "Live Async Web Scraper directly parses active target domains for real-time operational metadata and current offerings."),
        
        ("Generic LLM Chatbots\n(ChatGPT, Copilot, Claude)",
         "High hallucination risk; invents fake company names, fictitious URLs, and unverified executive contacts with no audit trail.",
         "Zero-Trust Validation Agent cross-references data across independent sources, calculating an explainable Source Reliability Index."),
        
        ("Manual Sales Navigators\n(LinkedIn Sales Nav, Manual Search)",
         "High latency & friction; sales reps waste up to 70% of time manually reviewing 15+ tabs per account with subjective ICP evaluation.",
         "Autonomous Planner & Discovery Agents deconstruct natural language ICP prompts into automated multi-agent task execution graphs."),
        
        ("Point Enrichment APIs\n(Clearbit, Hunter, People Data Labs)",
         "Disconnected, credit-heavy point APIs requiring complex manual pipeline stitching; lacks contextual ICP fit reasoning.",
         "End-to-End Autonomous Pipeline seamlessly unifying candidate discovery, live web grounding, scoring, and executive persona extraction."),
        
        ("Legacy CRM Lead Scoring\n(Salesforce Einstein, HubSpot)",
         "Black-box predictive scores based only on internal CRM activity; cannot discover or qualify net-new cold enterprise market accounts.",
         "Multi-dimensional weighted scoring (Tech Stack, Business Model, Geo) with transparent Confidence Tiers (High/Med/Low) & HITL review.")
    ]

    # Column Headers
    header_h = Inches(0.42)
    
    # Category / Solution Header
    dh = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(1.16), Inches(2.6), header_h)
    dh.fill.solid()
    dh.fill.fore_color.rgb = DARK_BG
    dh.line.color.rgb = BORDER_DARK
    p = dh.text_frame.paragraphs[0]
    p.text = "INDUSTRY SOLUTION TYPE"
    p.font.name = FONT_BOLD
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = TEXT_LIGHT_PRIMARY
    p.alignment = PP_ALIGN.CENTER

    # Existing header
    eh = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.3), Inches(1.16), Inches(4.3), header_h)
    eh.fill.solid()
    eh.fill.fore_color.rgb = RGBColor(0x5A, 0x2A, 0x26)
    eh.line.color.rgb = BORDER_DARK
    p = eh.text_frame.paragraphs[0]
    p.text = "EXISTING SOLUTIONS & LIMITATIONS"
    p.font.name = FONT_BOLD
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = TEXT_LIGHT_PRIMARY
    p.alignment = PP_ALIGN.CENTER

    # AgentSphere header
    ah = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.7), Inches(1.16), Inches(5.03), header_h)
    ah.fill.solid()
    ah.fill.fore_color.rgb = EMERALD_DEEP
    ah.line.color.rgb = BORDER_DARK
    p = ah.text_frame.paragraphs[0]
    p.text = "AGENTSPHERE AI (OUR PLATFORM ADVANTAGE)"
    p.font.name = FONT_BOLD
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = TEXT_LIGHT_PRIMARY
    p.alignment = PP_ALIGN.CENTER

    row_y_start = Inches(1.68)
    row_h = Inches(1.02)

    for idx, (dim, exist_text, our_text) in enumerate(comparisons):
        curr_y = row_y_start + idx * (row_h + Inches(0.08))
        
        # Dim / Solution Name Box
        dbox = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), curr_y, Inches(2.6), row_h)
        dbox.fill.solid()
        dbox.fill.fore_color.rgb = CARD_BG
        dbox.line.color.rgb = BORDER_LIGHT
        tb = s3.shapes.add_textbox(Inches(0.7), curr_y + Inches(0.1), Inches(2.4), row_h - Inches(0.2))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = dim
        p.font.name = FONT_BOLD
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK_PRIMARY

        # Existing Box
        ebox = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.3), curr_y, Inches(4.3), row_h)
        ebox.fill.solid()
        ebox.fill.fore_color.rgb = RGBColor(0xF8, 0xEE, 0xEC)
        ebox.line.color.rgb = RGBColor(0xDF, 0xCC, 0xC8)
        tb = s3.shapes.add_textbox(Inches(3.4), curr_y + Inches(0.08), Inches(4.1), row_h - Inches(0.15))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = exist_text
        p.font.name = FONT_BODY
        p.font.size = Pt(9.5)
        p.font.color.rgb = RGBColor(0x6A, 0x36, 0x32)

        # AgentSphere Box
        abox = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.7), curr_y, Inches(5.03), row_h)
        abox.fill.solid()
        abox.fill.fore_color.rgb = WHITE_CARD
        abox.line.color.rgb = EMERALD_DEEP
        abox.line.width = Pt(1.15)
        tb = s3.shapes.add_textbox(Inches(7.8), curr_y + Inches(0.08), Inches(4.83), row_h - Inches(0.15))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = our_text
        p.font.name = FONT_BODY
        p.font.size = Pt(9.5)
        p.font.color.rgb = TEXT_DARK_PRIMARY

    # =========================================================================
    # SLIDE 4: OBJECTIVES (3 Strategic Pillars)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s4, LIGHT_BG)
    add_header(s4, "Project Goals & System Capabilities", category_tag="CORE OBJECTIVES")

    objectives = [
        ("OBJECTIVE 1", "Autonomous Discovery & Task Planning",
         "Transform high-level natural language prospect requirements into formal ICP evaluation schemas and autonomous multi-agent task graphs.",
         "• Semantic ICP Parsing\n• Dynamic Candidate Sourcing\n• Non-blocking Task Planning"),
        ("OBJECTIVE 2", "Live Web Intelligence & Persona Extraction",
         "Eliminate hallucination by extracting real-time HTML metadata, live website footprints, active technologies, and key decision-maker personas.",
         "• Async Live Web Scraping\n• Real-Time Tech Stack Detection\n• Executive Contact Discovery"),
        ("OBJECTIVE 3", "Multi-Source Verification & Governance",
         "Cross-reference gathered claims across independent channels, generate source reliability scores, and route edge-cases to a Human-in-the-Loop review queue.",
         "• Cross-Source Fact Validation\n• Confidence Level Scoring (High/Med/Low)\n• Human-in-the-Loop Review Console")
    ]

    col_w = Inches(3.73)
    for idx, (tag, title, desc, bullet_pts) in enumerate(objectives):
        col_x = Inches(0.6) + idx * Inches(4.2)
        
        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col_x, Inches(1.25), col_w, Inches(5.5))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE_CARD
        card.line.color.rgb = BORDER_DARK
        card.line.width = Pt(1.2)

        badge = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col_x + Inches(0.25), Inches(1.5), col_w - Inches(0.5), Inches(0.4))
        badge.fill.solid()
        badge.fill.fore_color.rgb = EMERALD_DEEP
        badge.line.color.rgb = BORDER_DARK
        bp = badge.text_frame.paragraphs[0]
        bp.text = tag
        bp.font.name = FONT_BOLD
        bp.font.size = Pt(10.5)
        bp.font.bold = True
        bp.font.color.rgb = TEXT_LIGHT_PRIMARY
        bp.alignment = PP_ALIGN.CENTER

        tb = s4.shapes.add_textbox(col_x + Inches(0.25), Inches(2.1), col_w - Inches(0.5), Inches(4.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = title
        p.font.name = FONT_BOLD
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK_PRIMARY
        p.space_after = Pt(10)

        p = tf.add_paragraph()
        p.text = desc
        p.font.name = FONT_BODY
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_DARK_MUTED
        p.space_after = Pt(16)

        p = tf.add_paragraph()
        p.text = "KEY DELIVERABLES"
        p.font.name = FONT_BOLD
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = EMERALD_DEEP
        p.space_after = Pt(6)

        p = tf.add_paragraph()
        p.text = bullet_pts
        p.font.name = FONT_BODY
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_DARK_PRIMARY

    # =========================================================================
    # SLIDE 5: SYSTEM ARCHITECTURE (COMPREHENSIVE 8-LAYER AGENTIC BLUEPRINT)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s5, LIGHT_BG)
    add_header(s5, "AgentSphere AI — System Architecture", category_tag="AUTONOMOUS B2B PROSPECT DISCOVERY & INTELLIGENCE")

    # Helper function for mini cards/chips
    def add_arch_card(slide, l, t, w, h, title="", lines=None, bg=WHITE_CARD, bc=BORDER_LIGHT, tc=TEXT_DARK_PRIMARY, title_color=EMERALD_DEEP, title_size=9.5, body_size=7.8, bold_title=True, align=PP_ALIGN.LEFT):
        box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, l, t, w, h)
        box.fill.solid()
        box.fill.fore_color.rgb = bg
        box.line.color.rgb = bc
        box.line.width = Pt(0.9)

        tb = slide.shapes.add_textbox(l + Inches(0.04), t + Inches(0.03), w - Inches(0.08), h - Inches(0.06))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.04)
        tf.margin_right = Inches(0.04)
        tf.margin_top = Inches(0.03)
        tf.margin_bottom = Inches(0.03)

        if title:
            p = tf.paragraphs[0]
            p.text = title
            p.font.name = FONT_BOLD if bold_title else FONT_BODY
            p.font.size = Pt(title_size)
            p.font.bold = bold_title
            p.font.color.rgb = title_color
            p.alignment = align
            if lines:
                p.space_after = Pt(2)

        if lines:
            first = True if not title else False
            for line_txt in lines:
                if first:
                    p = tf.paragraphs[0]
                    first = False
                else:
                    p = tf.add_paragraph()
                p.text = line_txt
                p.font.name = FONT_BODY
                p.font.size = Pt(body_size)
                p.font.color.rgb = tc
                p.alignment = align
                p.space_after = Pt(1)
        return box

    # -------------------------------------------------------------------------
    # 1. USER INTERFACE / INPUT LAYER (Top Row)
    # -------------------------------------------------------------------------
    c1 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(1.10), Inches(12.133), Inches(0.86))
    c1.fill.solid()
    c1.fill.fore_color.rgb = RGBColor(0xEE, 0xEB, 0xE2)
    c1.line.color.rgb = BORDER_DARK
    c1.line.width = Pt(1.0)

    # Layer Tag
    tb1 = s5.shapes.add_textbox(Inches(0.70), Inches(1.12), Inches(3.0), Inches(0.22))
    p1 = tb1.text_frame.paragraphs[0]
    p1.text = "1. USER INTERFACE / INPUT LAYER"
    p1.font.name = FONT_BOLD
    p1.font.size = Pt(8.5)
    p1.font.bold = True
    p1.font.color.rgb = EMERALD_DEEP

    # Sub-box 1A: Sales / BD Persona
    add_arch_card(s5, Inches(0.75), Inches(1.36), Inches(2.20), Inches(0.53),
                  title="👤 Sales / BD Team",
                  lines=["Enterprise Growth & SDRs"],
                  bg=WHITE_CARD, bc=BORDER_LIGHT, title_size=9, body_size=7.5, align=PP_ALIGN.CENTER)

    # Sub-box 1B: Provide Input (ICP)
    add_arch_card(s5, Inches(3.05), Inches(1.36), Inches(2.80), Inches(0.53),
                  title="Provide Input (ICP Criteria)",
                  lines=["• Industry, Region, Company Size", "• Tech Stack, Keywords, Revenue"],
                  bg=WHITE_CARD, bc=BORDER_LIGHT, title_size=8.5, body_size=7.2)

    # Arrow 1: Input to Dashboard
    arr1 = s5.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, Inches(5.92), Inches(1.52), Inches(0.22), Inches(0.18))
    arr1.fill.solid()
    arr1.fill.fore_color.rgb = EMERALD_ACCENT
    arr1.line.fill.background()

    # Sub-box 1C: Web Dashboard
    add_arch_card(s5, Inches(6.20), Inches(1.36), Inches(2.75), Inches(0.53),
                  title="💻 Web Dashboard",
                  lines=["View results, manage agent swarm,", "inspect reasoning, export to CRM"],
                  bg=WHITE_CARD, bc=BORDER_LIGHT, title_size=8.5, body_size=7.2)

    # Sub-box 1D: Controls & Configuration
    add_arch_card(s5, Inches(9.05), Inches(1.36), Inches(3.58), Inches(0.53),
                  title="Configuration & Controls",
                  lines=["• Set discovery goals  • Configure filters", "• Monitor live progress  • View AI recommendations"],
                  bg=WHITE_CARD, bc=BORDER_LIGHT, title_size=8.5, body_size=7.2)

    # -------------------------------------------------------------------------
    # 2. ORCHESTRATOR AGENT (LLM) (Tier 2)
    # -------------------------------------------------------------------------
    c2 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(2.02), Inches(12.133), Inches(0.50))
    c2.fill.solid()
    c2.fill.fore_color.rgb = DARK_SURFACE
    c2.line.color.rgb = BORDER_DARK
    c2.line.width = Pt(1.0)

    tb2 = s5.shapes.add_textbox(Inches(0.75), Inches(2.05), Inches(5.4), Inches(0.44))
    tf2 = tb2.text_frame
    tf2.margin_top = Inches(0.02)
    p2 = tf2.paragraphs[0]
    p2.text = "🧠 2. Orchestrator Agent (Master LLM Controller)"
    p2.font.name = FONT_BOLD
    p2.font.size = Pt(9.5)
    p2.font.bold = True
    p2.font.color.rgb = RGBColor(0x8E, 0xC4, 0xA8)

    p2_sub = tf2.add_paragraph()
    p2_sub.text = "Plans, coordinates & manages all agents, tool usage and stateful workflow"
    p2_sub.font.name = FONT_BODY
    p2_sub.font.size = Pt(7.5)
    p2_sub.font.color.rgb = TEXT_LIGHT_MUTED

    # Orchestrator Pills / Capability Chips
    orch_chips = ["Task Planning", "Agent Routing", "Memory & Context", "Error Handling", "Result Aggregation"]
    chip_x = Inches(6.20)
    chip_w = Inches(1.24)
    for chip in orch_chips:
        box_c = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, chip_x, Inches(2.09), chip_w, Inches(0.34))
        box_c.fill.solid()
        box_c.fill.fore_color.rgb = RGBColor(0x3B, 0x3E, 0x46)
        box_c.line.color.rgb = EMERALD_ACCENT
        box_c.line.width = Pt(0.8)
        cp = box_c.text_frame.paragraphs[0]
        cp.text = chip
        cp.font.name = FONT_BOLD
        cp.font.size = Pt(7.5)
        cp.font.color.rgb = TEXT_LIGHT_PRIMARY
        cp.alignment = PP_ALIGN.CENTER
        chip_x += chip_w + Inches(0.08)

    # -------------------------------------------------------------------------
    # 3. SPECIALIZED AI AGENTS (Tier 3 - 6 Autonomous Swarm Members)
    # -------------------------------------------------------------------------
    c3 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(2.58), Inches(12.133), Inches(1.48))
    c3.fill.solid()
    c3.fill.fore_color.rgb = RGBColor(0xF0, 0xED, 0xE3)
    c3.line.color.rgb = BORDER_DARK
    c3.line.width = Pt(1.0)

    tb3 = s5.shapes.add_textbox(Inches(0.70), Inches(2.60), Inches(3.0), Inches(0.20))
    p3 = tb3.text_frame.paragraphs[0]
    p3.text = "3. SPECIALIZED AI AGENTS"
    p3.font.name = FONT_BOLD
    p3.font.size = Pt(8.5)
    p3.font.bold = True
    p3.font.color.rgb = EMERALD_DEEP

    agents_data = [
        ("🔍 1. Discovery Agent",
         ["• Finds candidate companies", "• Apollo API & databases", "• Extracts firmographics"],
         RGBColor(0x2E, 0x47, 0x3B), RGBColor(0xE9, 0xF1, 0xEE)),
        ("📄 2. Research Agent",
         ["• Deep website analysis", "• Products & tech stack", "• Leadership & contacts"],
         RGBColor(0x2A, 0x4B, 0x5E), RGBColor(0xEB, 0xF2, 0xF7)),
        ("📈 3. Signal Agent",
         ["• Real-time hiring & funding", "• News, PR & expansions", "• Tech adoption changes"],
         RGBColor(0x66, 0x4D, 0x1A), RGBColor(0xFA, 0xF4, 0xE8)),
        ("🛡️ 4. Validation Agent",
         ["• Cross-verifies sources", "• Deduplicates records", "• Handles conflicting data"],
         RGBColor(0x6E, 0x2A, 0x2A), RGBColor(0xFA, 0xEE, 0xEE)),
        ("🎯 5. ICP / Fit Agent",
         ["• Matches ICP criteria", "• Evaluates size & geo fit", "• Multi-dim fit assessment"],
         RGBColor(0x4A, 0x2E, 0x6E), RGBColor(0xF4, 0xEE, 0xFA)),
        ("⭐ 6. Scoring & Recom.",
         ["• Prospect score ranking", "• Generates reasoning", "• Next action suggestions"],
         RGBColor(0x1F, 0x44, 0x6E), RGBColor(0xEE, 0xF3, 0xFA))
    ]

    ag_x = Inches(0.72)
    ag_w = Inches(1.88)
    ag_h = Inches(1.18)
    for idx, (ag_title, ag_lines, head_col, card_bg) in enumerate(agents_data):
        add_arch_card(s5, ag_x, Inches(2.82), ag_w, ag_h,
                      title=ag_title, lines=ag_lines,
                      bg=WHITE_CARD, bc=BORDER_DARK,
                      title_color=head_col, title_size=8.5, body_size=7.2)
        
        # Add connector arrow between agents
        if idx < 5:
            arr_ag = s5.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, ag_x + ag_w + Inches(0.01), Inches(3.32), Inches(0.12), Inches(0.14))
            arr_ag.fill.solid()
            arr_ag.fill.fore_color.rgb = EMERALD_ACCENT
            arr_ag.line.fill.background()
            
        ag_x += ag_w + Inches(0.14)

    # -------------------------------------------------------------------------
    # 4, 5, 6, 7: MIDDLE INFRASTRUCTURE TIER (External Sources, Processing, Storage, LLM Layer)
    # -------------------------------------------------------------------------
    
    # 4. EXTERNAL DATA SOURCES (Left Column)
    c4 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(4.12), Inches(2.20), Inches(1.72))
    c4.fill.solid()
    c4.fill.fore_color.rgb = RGBColor(0xEE, 0xEB, 0xE2)
    c4.line.color.rgb = BORDER_DARK
    c4.line.width = Pt(1.0)

    tb4 = s5.shapes.add_textbox(Inches(0.66), Inches(4.14), Inches(2.08), Inches(0.20))
    p4 = tb4.text_frame.paragraphs[0]
    p4.text = "4. EXTERNAL DATA SOURCES"
    p4.font.name = FONT_BOLD
    p4.font.size = Pt(8.0)
    p4.font.bold = True
    p4.font.color.rgb = EMERALD_DEEP

    ext_sources = [
        "⚡ Apollo API (Company Data)",
        "🌐 Web Search (Google, Bing)",
        "📰 News APIs (NewsAPI, RSS)",
        "💼 Job Feeds (LinkedIn, Indeed)",
        "🏢 Company Sites (Web Scraping)",
        "💰 Funding DBs (Crunchbase)"
    ]
    add_arch_card(s5, Inches(0.70), Inches(4.34), Inches(2.00), Inches(1.44),
                  lines=ext_sources, bg=WHITE_CARD, bc=BORDER_LIGHT, tc=TEXT_DARK_PRIMARY, body_size=7.1)

    # 5 & 6: DATA PROCESSING & STORAGE (Middle Column)
    # 5. Data Processing Layer
    c5 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.88), Inches(4.12), Inches(6.80), Inches(0.78))
    c5.fill.solid()
    c5.fill.fore_color.rgb = RGBColor(0xEE, 0xEB, 0xE2)
    c5.line.color.rgb = BORDER_DARK
    c5.line.width = Pt(1.0)

    tb5 = s5.shapes.add_textbox(Inches(2.96), Inches(4.14), Inches(3.0), Inches(0.18))
    p5 = tb5.text_frame.paragraphs[0]
    p5.text = "5. DATA PROCESSING LAYER"
    p5.font.name = FONT_BOLD
    p5.font.size = Pt(8.0)
    p5.font.bold = True
    p5.font.color.rgb = EMERALD_DEEP

    dp_steps = [
        ("📥 Data Ingestion", Inches(2.96), Inches(1.42)),
        ("⚙️ Cleaning & Normal.", Inches(4.56), Inches(1.54)),
        ("📑 Entity Extraction", Inches(6.28), Inches(1.54)),
        ("🔗 Enrichment & Struct.", Inches(8.00), Inches(1.58))
    ]
    for idx, (step_title, sx, sw) in enumerate(dp_steps):
        add_arch_card(s5, sx, Inches(4.34), sw, Inches(0.48),
                      title=step_title, bg=WHITE_CARD, bc=BORDER_LIGHT,
                      title_color=TEXT_DARK_PRIMARY, title_size=7.5, align=PP_ALIGN.CENTER)
        if idx < 3:
            arr_dp = s5.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, sx + sw + Inches(0.03), Inches(4.49), Inches(0.12), Inches(0.14))
            arr_dp.fill.solid()
            arr_dp.fill.fore_color.rgb = EMERALD_ACCENT
            arr_dp.line.fill.background()

    # 6. Storage Layer
    c6 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.88), Inches(4.96), Inches(6.80), Inches(0.88))
    c6.fill.solid()
    c6.fill.fore_color.rgb = RGBColor(0xEE, 0xEB, 0xE2)
    c6.line.color.rgb = BORDER_DARK
    c6.line.width = Pt(1.0)

    tb6 = s5.shapes.add_textbox(Inches(2.96), Inches(4.98), Inches(3.0), Inches(0.18))
    p6 = tb6.text_frame.paragraphs[0]
    p6.text = "6. STORAGE LAYER"
    p6.font.name = FONT_BOLD
    p6.font.size = Pt(8.0)
    p6.font.bold = True
    p6.font.color.rgb = EMERALD_DEEP

    storage_nodes = [
        ("🗄️ Relational DB (PostgreSQL)", ["Structured company records,", "contacts, queries & scores"], Inches(2.96), Inches(2.10)),
        ("🧠 Vector DB (pgvector / Pinecone)", ["Semantic company embeddings,", "similarity & neural search"], Inches(5.18), Inches(2.18)),
        ("🕸️ Knowledge Graph (Optional)", ["B2B company relationships,", "tech stacks & co-investors"], Inches(7.48), Inches(2.10))
    ]
    for st_title, st_lines, sx, sw in storage_nodes:
        add_arch_card(s5, sx, Inches(5.18), sw, Inches(0.60),
                      title=st_title, lines=st_lines,
                      bg=WHITE_CARD, bc=BORDER_LIGHT,
                      title_color=EMERALD_DEEP, title_size=7.6, body_size=6.8)

    # 7. LLM & TOOLS LAYER (Right Column)
    c7 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.76), Inches(4.12), Inches(2.97), Inches(1.72))
    c7.fill.solid()
    c7.fill.fore_color.rgb = RGBColor(0xEE, 0xEB, 0xE2)
    c7.line.color.rgb = BORDER_DARK
    c7.line.width = Pt(1.0)

    tb7 = s5.shapes.add_textbox(Inches(9.84), Inches(4.14), Inches(2.8), Inches(0.20))
    p7 = tb7.text_frame.paragraphs[0]
    p7.text = "7. LLM & TOOLS LAYER"
    p7.font.name = FONT_BOLD
    p7.font.size = Pt(8.0)
    p7.font.bold = True
    p7.font.color.rgb = EMERALD_DEEP

    llm_tools = [
        ("🤖 LLM Foundation Models", ["GPT-4o, Claude 3.5 Sonnet"]),
        ("🔧 Tool Integration Engine", ["APIs, Web Scrapers, Resolvers"]),
        ("📚 RAG System", ["Retrieval Augmented Generation"]),
        ("💻 Function Calling", ["Structured JSON Schema Tool Use"])
    ]
    ly = Inches(4.34)
    for lt_title, lt_lines in llm_tools:
        add_arch_card(s5, Inches(9.84), ly, Inches(2.81), Inches(0.33),
                      title=lt_title, lines=lt_lines,
                      bg=WHITE_CARD, bc=BORDER_LIGHT,
                      title_color=TEXT_DARK_PRIMARY, title_size=7.4, body_size=6.6)
        ly += Inches(0.36)

    # -------------------------------------------------------------------------
    # 8. OUTPUT LAYER (Tier 8)
    # -------------------------------------------------------------------------
    c8 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(5.90), Inches(12.133), Inches(0.64))
    c8.fill.solid()
    c8.fill.fore_color.rgb = RGBColor(0xEE, 0xEB, 0xE2)
    c8.line.color.rgb = BORDER_DARK
    c8.line.width = Pt(1.0)

    tb8 = s5.shapes.add_textbox(Inches(0.70), Inches(5.92), Inches(2.0), Inches(0.18))
    p8 = tb8.text_frame.paragraphs[0]
    p8.text = "8. OUTPUT LAYER"
    p8.font.name = FONT_BOLD
    p8.font.size = Pt(8.0)
    p8.font.bold = True
    p8.font.color.rgb = EMERALD_DEEP

    out_cards = [
        ("📊 AgentSphere Dashboard", ["Company list, scores, signals & reasons"], Inches(2.05), Inches(2.55)),
        ("✉️ Export to CRM", ["Salesforce, HubSpot & webhook sync"], Inches(4.70), Inches(2.40)),
        ("🔔 Alerts & Notifications", ["High-priority prospect real-time alerts"], Inches(7.20), Inches(2.45)),
        ("📈 Reports & Insights", ["Market trends & competitive ICP analysis"], Inches(9.75), Inches(2.88))
    ]
    for oc_title, oc_lines, ox, ow in out_cards:
        add_arch_card(s5, ox, Inches(6.08), ow, Inches(0.42),
                      title=oc_title, lines=oc_lines,
                      bg=WHITE_CARD, bc=BORDER_LIGHT,
                      title_color=EMERALD_DEEP, title_size=7.6, body_size=6.8)

    # -------------------------------------------------------------------------
    # BUSINESS IMPACT BANNER (Footer Ribbon)
    # -------------------------------------------------------------------------
    b_imp = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(6.60), Inches(12.133), Inches(0.44))
    b_imp.fill.solid()
    b_imp.fill.fore_color.rgb = EMERALD_DEEP
    b_imp.line.color.rgb = BORDER_DARK
    b_imp.line.width = Pt(1.0)

    # Badge on left
    tb_imp_title = s5.shapes.add_textbox(Inches(0.70), Inches(6.64), Inches(2.0), Inches(0.32))
    p_imp = tb_imp_title.text_frame.paragraphs[0]
    p_imp.text = "🏆 Business Impact:"
    p_imp.font.name = FONT_BOLD
    p_imp.font.size = Pt(9.5)
    p_imp.font.bold = True
    p_imp.font.color.rgb = RGBColor(0x8E, 0xC4, 0xA8)

    impact_items = [
        "✓ Discover the right companies",
        "✓ Save 80%+ research time",
        "✓ Focus on high-quality prospects",
        "✓ Accelerate pipeline conversion"
    ]
    im_x = Inches(2.75)
    im_w = Inches(2.30)
    for item in impact_items:
        tb_item = s5.shapes.add_textbox(im_x, Inches(6.64), im_w, Inches(0.32))
        pi = tb_item.text_frame.paragraphs[0]
        pi.text = item
        pi.font.name = FONT_BOLD
        pi.font.size = Pt(8.5)
        pi.font.color.rgb = TEXT_LIGHT_PRIMARY
        im_x += im_w + Inches(0.05)

    # =========================================================================
    # SLIDE 6: WORKFLOW (Dynamic 6-Stage Execution Pipeline)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s6, LIGHT_BG)
    add_header(s6, "End-to-End Autonomous Execution Pipeline", category_tag="PIPELINE WORKFLOW")

    pipeline_steps = [
        ("01", "Strategy & ICP Decomposition", "User submits natural language query; Planner Agent parses parameters and builds a tailored multi-agent execution graph.", Inches(0.6), Inches(1.2)),
        ("02", "Candidate Entity Discovery", "Discovery Agent searches and identifies candidate company entities matching the target industry, geography, and operational model.", Inches(4.8), Inches(1.2)),
        ("03", "Live Web Scraping & Grounding", "Web Scraper Agent connects directly to target domains, extracting live HTML title, meta tags, and verifying active operations.", Inches(9.0), Inches(1.2)),
        ("04", "Cross-Source Verification", "Validation Agent cross-references company claims across independent web data and APIs, computing a composite Source Reliability Score.", Inches(0.6), Inches(4.2)),
        ("05", "Weighted Multi-Dimension Scoring", "Decision Agent calculates weighted ICP fit percentage and assigns definitive Confidence Tiers: High, Medium, or Low.", Inches(4.8), Inches(4.2)),
        ("06", "Contact Enrichment & Review", "Contact Enricher surfaces verified executive personas (CEO, CTO, VP). Borderline leads are queued for Human Review.", Inches(9.0), Inches(4.2))
    ]

    for num, title, desc, x, y in pipeline_steps:
        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(3.73), Inches(2.8))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE_CARD
        card.line.color.rgb = BORDER_DARK
        card.line.width = Pt(1.1)

        tb_num = s6.shapes.add_textbox(x + Inches(0.2), y + Inches(0.12), Inches(1.0), Inches(0.45))
        p = tb_num.text_frame.paragraphs[0]
        p.text = num
        p.font.name = FONT_TITLE
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = EMERALD_DEEP

        tb_t = s6.shapes.add_textbox(x + Inches(0.2), y + Inches(0.65), Inches(3.33), Inches(0.45))
        p = tb_t.text_frame.paragraphs[0]
        p.text = title
        p.font.name = FONT_BOLD
        p.font.size = Pt(12.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK_PRIMARY

        tb_d = s6.shapes.add_textbox(x + Inches(0.2), y + Inches(1.15), Inches(3.33), Inches(1.5))
        tf = tb_d.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = desc
        p.font.name = FONT_BODY
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_DARK_MUTED

    # =========================================================================
    # SLIDE 7: TECH STACK (Modern Categorized Bento Grid)
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s7, LIGHT_BG)
    add_header(s7, "Technology Stack & Core Dependencies", category_tag="IMPLEMENTATION STACK")

    tech_categories = [
        ("FRONTEND & UI", "Interactive Experience",
         [
             ("Framework", "React 18 + TypeScript"),
             ("Build Tool", "Vite (Fast HMR & Bundler)"),
             ("Styling", "Tailwind CSS + Glassmorphism"),
             ("Iconography", "Lucide React Icons"),
             ("State Sync", "React Hooks & Streaming APIs")
         ],
         Inches(0.6)),
        ("BACKEND & API", "High-Throughput Core",
         [
             ("API Engine", "FastAPI (Python 3.10+)"),
             ("Schema Validation", "Pydantic v2 Models"),
             ("ASGI Server", "Uvicorn Async Server"),
             ("Architecture", "Event-Driven Multi-Agent Pipeline"),
             ("Execution Control", "Dry-run Planner & Full Run Endpoints")
         ],
         Inches(4.8)),
        ("AI, SCRAPING & DATA", "Intelligence Layer",
         [
             ("Web Scraper", "Async HTTPX + Live HTML Parser"),
             ("Entity Discovery", "LLM Heuristic Chains"),
             ("Enrichment API", "Apollo REST Service Integration"),
             ("Verification", "Source Reliability Index Engine"),
             ("Memory Store", "Thread-Safe In-Memory DB")
         ],
         Inches(9.0))
    ]

    for cat_tag, cat_title, items, col_x in tech_categories:
        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col_x, Inches(1.2), col_w, Inches(5.6))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE_CARD
        card.line.color.rgb = BORDER_DARK
        card.line.width = Pt(1.1)

        badge = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col_x + Inches(0.2), Inches(1.4), col_w - Inches(0.4), Inches(0.38))
        badge.fill.solid()
        badge.fill.fore_color.rgb = DARK_BG
        badge.line.color.rgb = BORDER_DARK
        bp = badge.text_frame.paragraphs[0]
        bp.text = cat_tag
        bp.font.name = FONT_BOLD
        bp.font.size = Pt(10)
        bp.font.bold = True
        bp.font.color.rgb = TEXT_LIGHT_PRIMARY
        bp.alignment = PP_ALIGN.CENTER

        tb = s7.shapes.add_textbox(col_x + Inches(0.2), Inches(1.85), col_w - Inches(0.4), Inches(0.35))
        p = tb.text_frame.paragraphs[0]
        p.text = cat_title
        p.font.name = FONT_BOLD
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK_PRIMARY
        p.alignment = PP_ALIGN.CENTER

        for row_idx, (k, v) in enumerate(items):
            row_y = Inches(2.35) + row_idx * Inches(0.88)
            row_box = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col_x + Inches(0.2), row_y, col_w - Inches(0.4), Inches(0.75))
            row_box.fill.solid()
            row_box.fill.fore_color.rgb = CARD_BG
            row_box.line.color.rgb = BORDER_LIGHT

            tb_r = s7.shapes.add_textbox(col_x + Inches(0.25), row_y + Inches(0.05), col_w - Inches(0.5), Inches(0.65))
            tf_r = tb_r.text_frame
            tf_r.word_wrap = True
            
            pk = tf_r.paragraphs[0]
            pk.text = k.upper()
            pk.font.name = FONT_BOLD
            pk.font.size = Pt(8.5)
            pk.font.color.rgb = EMERALD_DEEP

            pv = tf_r.add_paragraph()
            pv.text = v
            pv.font.name = FONT_BODY
            pv.font.size = Pt(11)
            pv.font.bold = True
            pv.font.color.rgb = TEXT_DARK_PRIMARY

    # =========================================================================
    # SLIDE 8: CONCLUSION & SUMMARY (Dark Hero Closing Slide)
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s8, DARK_BG)
    add_header(s8, "Summary & Key Project Contributions", category_tag="CONCLUSION", dark=True)

    takeaways = [
        ("The Problem", "B2B prospecting is throttled by manual research, outdated static databases, and high AI hallucination rates."),
        ("The Solution", "AgentSphere AI delivers an end-to-end multi-agent system combining live web scraping with semantic ICP matching."),
        ("Core Value Delivered", "Eliminates hallucination via cross-source validation; provides explainable confidence scoring (High/Med/Low)."),
        ("Future Roadmap", "Integrating multi-modal scrapers (PDF annual reports, 10-K filings) and autonomous multi-channel outreach agents.")
    ]

    for idx, (t, d) in enumerate(takeaways):
        tx = Inches(0.6) if idx % 2 == 0 else Inches(6.88)
        ty = Inches(1.2) if idx < 2 else Inches(2.45)

        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, tx, ty, Inches(5.85), Inches(1.1))
        card.fill.solid()
        card.fill.fore_color.rgb = DARK_SURFACE
        card.line.color.rgb = RGBColor(0x38, 0x3B, 0x42)

        tb = s8.shapes.add_textbox(tx + Inches(0.2), ty + Inches(0.12), Inches(5.45), Inches(0.85))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = t
        p.font.name = FONT_BOLD
        p.font.size = Pt(12.5)
        p.font.bold = True
        p.font.color.rgb = EMERALD_ACCENT
        p.space_after = Pt(3)

        p = tf.add_paragraph()
        p.text = d
        p.font.name = FONT_BODY
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_LIGHT_MUTED

    # Divider
    line_c = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(3.85), Inches(12.13), Inches(0.015))
    line_c.fill.solid()
    line_c.fill.fore_color.rgb = RGBColor(0x3A, 0x3D, 0x44)
    line_c.line.color.rgb = RGBColor(0x3A, 0x3D, 0x44)

    # Thank You Callout
    ty_tb = s8.shapes.add_textbox(Inches(1.5), Inches(4.35), Inches(10.33), Inches(2.2))
    p_ty = ty_tb.text_frame.paragraphs[0]
    p_ty.text = "Thank You"
    p_ty.font.name = FONT_TITLE
    p_ty.font.size = Pt(56)
    p_ty.font.bold = True
    p_ty.font.color.rgb = TEXT_LIGHT_PRIMARY
    p_ty.alignment = PP_ALIGN.CENTER

    p_sub = ty_tb.text_frame.add_paragraph()
    p_sub.text = "Open for Questions & Technical Evaluation"
    p_sub.font.name = FONT_BODY
    p_sub.font.size = Pt(15)
    p_sub.font.color.rgb = TEXT_LIGHT_MUTED
    p_sub.alignment = PP_ALIGN.CENTER

    targets = [
        "AgentSphere_Deloitte.pptx",
        "AgentSphere_AI_Deloitte_Capstone.pptx",
        "AgentSphere_AI_Presentation_v2.pptx",
        "AgentSphere_AI_Presentation.pptx",
        "AgentSphere_AI_Review_Presentation.pptx"
    ]
    for target in targets:
        try:
            prs.save(target)
            print(f"Successfully updated deck: {os.path.abspath(target)}")
        except Exception as e:
            print(f"Skipping {target} (likely currently open in PowerPoint): {e}")

if __name__ == "__main__":
    build_deloitte_deck()
