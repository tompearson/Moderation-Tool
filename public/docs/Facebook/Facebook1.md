# Facebook (Meta) Community Standards – Quick Reference Table

| Category | Remove If | Allow If | Examples | Reference |
|----------|-----------|----------|----------|-----------|
| **V1 – Violence & Incitement** | Threats or calls for serious harm; instructions for violence | — | "We should bomb that school tomorrow"; weapon-making instructions | [Link](https://transparency.meta.com/policies/community-standards/violence-incitement/) |
| **D1 – Dangerous Individuals & Orgs** | Support or coordination for extremist/terror groups | — | Posting logos of terrorist organizations; fundraising for extremist groups | [Link](https://transparency.meta.com/policies/community-standards/dangerous-individuals-organizations/) |
| **H1 – Hateful Conduct** | Attacks on protected characteristics; dehumanizing/exclusion | — | Calling immigrants "animals"; excluding a religion from public spaces | [Link](https://transparency.meta.com/policies/community-standards/hate-speech/) |
| **B1 – Bullying & Harassment** | Targeted insults; sexual harassment; doxxing; manipulated media | — | Altered photos to mock someone; publishing a minor’s address | [Link](https://transparency.meta.com/policies/community-standards/bullying-harassment/) |
| **S1 – Suicide & Self-Injury** | Encouragement or glorification of suicide/self-harm | Non-graphic discussion seeking support | Instructions to commit suicide; glorifying self-harm scars | [Link](https://transparency.meta.com/policies/community-standards/suicide-self-injury/) |
| **CSE1 – Child Sexual Exploitation & Nudity** | Sexualized content of minors; grooming or solicitation | — | Sexualized cartoon of a child; soliciting minors | [Link](https://transparency.meta.com/policies/community-standards/child-sexual-exploitation-abuse-nudity/) |
| **N1 – Adult Sexual Content & Nudity** | Pornographic or explicit sexual activity; non-consensual intimate images | Non-sexual nudity in art, health, or breastfeeding | Posting porn videos; threatening to leak intimate photos | [Link](https://transparency.meta.com/policies/community-standards/adult-nudity-sexual-activity/) |
| **HE1 – Human Exploitation** | Trafficking, forced labor, or commercial sexual offers | — | Advertising human trafficking; offering sexual services for money | [Link](https://transparency.meta.com/policies/community-standards/human-exploitation/) |
| **P1 – Privacy Violations & Image Rights** | Sharing PII or non-consensual imagery | — | Sharing someone’s ID; posting humiliating deepfakes | [Link](https://transparency.meta.com/policies/community-standards/privacy-violations/) |
| **IP1 – Intellectual Property** | Copyright or trademark infringement | — | Uploading movies without rights; selling counterfeit items | [Link](https://transparency.meta.com/policies/community-standards/intellectual-property/) |
| **F1 – Fraud, Deception & Spam** | Scams, phishing, impersonation, mass posting | — | Fake giveaways; bots posting same ads across groups | [Link](https://transparency.meta.com/policies/community-standards/fraud-deception-spam/) |
| **M1 – Misinformation** | False info causing imminent harm | Other misinformation may be downranked or labeled | Drinking bleach cures disease; false election info | [Link](https://transparency.meta.com/policies/community-standards/misinformation/) |
| **CIV1 – Civic Integrity & Elections** | Interference with civic processes; intimidation | — | Misleading how to vote; threatening election officials | [Link](https://transparency.meta.com/policies/community-standards/civic-integrity/) |
| **RG1 – Restricted Goods & Services** | Trade/sale of prohibited goods/services | — | Selling firearms or prescription drugs illegally | [Link](https://transparency.meta.com/policies/community-standards/restricted-goods-services/) |
| **CR1 – Coordinating Harm/Criminal Activity** | Facilitation or instruction for criminal acts | — | Organizing theft rings; conspiracy-driven violence | [Link](https://transparency.meta.com/policies/community-standards/criminal-activity/) |
| **A1 – Authenticity & Identity Misrepresentation** | Impersonation or coordinated inauthentic behavior | — | Fake celebrity accounts; multiple pages to boost content | [Link](https://transparency.meta.com/policies/community-standards/authentic-identity/) |
| **VG1 – Violent & Graphic Content** | Gratuitous or glorifying extreme gore | Newsworthy or condemning content with warning | Videos glorifying decapitations; gore images for shock | [Link](https://transparency.meta.com/policies/community-standards/violent-graphic-content/) |

---

**Enforcement:**  
- Remove content  
- Temporary restrictions or feature limits  
- Account suspension or termination  
- Referral to law enforcement if required  

**Considerations:** Severity, intent, target status (minor/private/public), recency, and risk of harm.

---

**Moderation Output Contract:**  
- **Format:** JSON only  
- **Required Fields:** `Decision`, `Reason`  
- **Decision Options:** `Remove`, `Keep`, `Maybe Remove`  
- **Rules:** Reason must end with a period; no advice or qualifiers.  

**Example:**  
```json
{
  "Decision": "Remove",
  "Reason": "Contains targeted harassment and doxxing against a private individual."
}
