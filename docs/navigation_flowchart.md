# EcoSphere Project Navigation Flowchart

Based on our system's architecture and the features outlined in the technical specification, here is the frontend navigation flowchart. It's structured similarly to your example, mapping out the main views and how users will navigate through the EcoSphere ESG Management Platform depending on their roles.

```mermaid
flowchart TD
    %% Base Pages
    Landing["Login / SSO Authentication\n(JWT Access)"]
    
    %% Main Routing
    Landing --> RoleRouter{"Role-Based Routing\n(Admin / Dept Head / Employee)"}
    
    RoleRouter --> MainDash["Main Dashboard\n(Aggregated ESG Scores & Summaries)"]
    
    %% Top Level Navigation
    MainDash --> EnvModule["Environmental"]
    MainDash --> SocModule["Social"]
    MainDash --> GovModule["Governance"]
    MainDash --> Gamification["Gamification & Engagement"]
    MainDash --> Reporting["Reporting & Analytics"]
    MainDash --> Settings["Administration"]
    
    %% Environmental Pages
    EnvModule --> EnvTrans["Carbon Transactions"]
    EnvModule --> EnvGoals["Environmental Goals"]
    
    %% Social Pages
    SocModule --> SocCSR["CSR Activities & Participation"]
    SocModule --> SocDiv["Diversity Metrics"]
    
    %% Governance Pages
    GovModule --> GovPol["Policies & Acknowledgements"]
    GovModule --> GovAudits["Audits & Compliance Issues"]
    
    %% Gamification Pages
    Gamification --> GamChall["Challenges\n(Draft / Active / Completed)"]
    Gamification --> GamLead["Leaderboards"]
    Gamification --> GamBadges["My Badges & Rewards Redemption"]
    
    %% Reporting Pages
    Reporting --> RepCustom["Custom Report Builder"]
    Reporting --> RepExports["Exported Reports (PDF/Excel/CSV)"]
    
    %% Settings
    Settings --> SetConfig["ESG Configuration & Weights"]
    Settings --> SetOrg["Department & Category Management"]
    
    %% Styling based on roles (Optional visual aid)
    classDef allUsers fill:#2b5c8f,stroke:#fff,stroke-width:2px,color:#fff;
    classDef restricted fill:#1a365d,stroke:#fff,stroke-width:2px,color:#fff;
    
    class Landing,MainDash,EnvModule,SocModule,GovModule,Gamification,EnvTrans,EnvGoals,SocCSR,SocDiv,GovPol,GovAudits,GamChall,GamLead,GamBadges allUsers;
    class Reporting,Settings,RepCustom,RepExports,SetConfig,SetOrg restricted;
```

### Key Takeaways for the Frontend Layout
- **Blue Boxes**: Accessible by all authenticated employees.
- **Dark Blue Boxes**: Usually restricted to **Admins** and **Department Heads** (e.g., configuring score weights, managing organizational hierarchy, and building custom reports).
- **Gamification**: Is available everywhere. For example, completing a CSR Activity in the "Social" module will automatically update progress in the "Challenges" section and potentially award a Badge behind the scenes.

This matches exactly with the independent domains we mapped out for the backend. Does this high-level view make the project feel a bit more approachable? Let me know, and we can proceed to scaffolding the actual code!
