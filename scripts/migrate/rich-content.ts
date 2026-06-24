/**
 * Full product/service content captured verbatim from the live (JS-rendered)
 * tmeeting.se pages via Claude-in-Chrome on 2026-06-23. Wording preserved;
 * structured into markdown headings/lists for Strapi blocks.
 *
 * NOTE: contains medical-device/regulatory wording (MDR class I, etc.) — review
 * in the Strapi admin before publishing to production.
 */

export interface RichItem {
  slug: string;
  shortDescription: string;
  descriptionMd: string;
}

export const products: RichItem[] = [
  {
    slug: 'tera',
    shortDescription:
      'TERA – Telefoni på dina villkor. Ring och ta emot samtal via vanligt telefonnummer med stöd för ljud, video, text och AI-talsyntes.',
    descriptionMd: `## Vad är TERA?

TERA är ett unikt kommunikationshjälpmedel som gör det möjligt att ringa och ta emot samtal via vanligt telefonnummer – med stöd för ljud, video, text och AI-talsyntes. Lösningen är särskilt utvecklad för dig som är döv, har en hörselnedsättning, är dövblind eller har talsvårigheter. TERA fungerar både på mobil och surfplatta, och ger dig möjlighet att kommunicera självständigt – som komplement till tolk eller helt på egen hand. Du väljer själv vilka funktioner du vill använda beroende på situation och behov.

Produkten är ett medicintekniskt hjälpmedel (klass I) enligt MDR (EU) 2017/745, särskilt anpassad för personer med funktionsnedsättning.

## Anpassa TERA efter dina behov

**Teckenspråkig?** Använd både tal–till–text och text–till–tal. Det din samtalspartner säger textas automatiskt, och det du skriver läses upp med TERAs AI-talsyntes. Du kan välja mellan manlig eller kvinnlig röst. Det går även att ringa videosamtal med andra teckenspråkiga via bildtelefon.

**Hörselnedsättning eller vuxendövhet?** Använd endast tal–till–text. Du ser det som sägs som text i realtid, och talar själv som vanligt – samtalspartnern hör din röst. Perfekt som stöd om du missar vissa ord i samtalet.

**Talsvårigheter?** Använd endast text–till–tal. Du skriver ditt svar och hör samtalspartnerns röst, medan TERA läser upp din text med syntetiskt tal.

## TERA-Touch (iPadOS/Android)

Autotextning, talsyntes och video på din surfplatta. TERA-Touch är TERA för surfplatta – perfekt både hemma och i andra miljöer. Den större skärmen ger en bättre upplevelse vid videosamtal, samtidigt som enheten är smidig och lätt att ta med.

## TERA-Mobile (iOS/Android)

Autotextning, talsyntes och video i din smartphone. TERA-Mobile är den mobilanpassade versionen av TERA-Touch. Den passar dig som är mycket på språng och främst kommunicerar via din mobiltelefon.

## TERA-Local – samtal i samma rum

TERA-Local är en inbyggd funktion i TERA som gör det möjligt att kommunicera med personer i samma fysiska rum – till exempel kollegor, läkare eller butikspersonal. Det som sägs textas i realtid, och du kan svara med talsyntes direkt från appen – utan att den andra personen behöver någon särskild utrustning eller app.

Du kan växla smidigt mellan lokala samtal med TERA-Local och vanliga telefonsamtal – direkt i samma app. Tjänsten fungerar lika bra i vardagssamtal som i möten, vårdbesök eller andra miljöer där tydlig och tillgänglig kommunikation behövs.

TERA-Local stödjer även flerpartssamtal, där röstigenkänning visar vem som säger vad, vilket ökar tydlighet och förståelse i samtal med flera personer. Texten visas tydligt även för samtalspartnern, vilket underlättar ömsesidig kommunikation. Röstigenkänning för flerpartssamtal är för närvarande inte tillgänglig på Android.

## Flerspråkig autotextning

TERA kan nu automatiskt texta samtal i realtid på över 40 språk. Texten kan visas på det språk som talas eller på ett språk användaren själv väljer. Språket identifieras automatiskt under samtalet utan att några inställningar behöver göras.

Funktionen kan exempelvis användas för att:

- följa samtal på olika språk i realtid
- läsa text på ett valt språk även om motparten talar ett annat språk
- underlätta kommunikation mellan personer som föredrar olika språk
- följa samtal där flera språk används samtidigt
- ge stöd vid dialekter eller varierande språknivåer

Den nya funktionen ingår utan extra kostnad för alla befintliga och nya TERA-användare, men behöver sättas på innan den kan användas (bland inställningarna). Automatisk textning och språkidentifiering genereras av systemet och kan påverkas av exempelvis ljudmiljö, dialekter och uppkoppling.

## Användningsområden

**Hälsa.** Med TERA kan du kontakta vårdcentralen, 1177 och andra instanser – samtalet textas i realtid, även genom växlar. Det ger dig kontroll i viktiga samtal, särskilt när det är bråttom. Du kan välja att spara texten för att minnas vad som sades.

**Håll kontakten.** TERA gör det enkelt att ringa familj och vänner – utan att de behöver någon särskild app. För dig med talsvårigheter finns stöd med talsyntes och text. Du kan också använda video för att kommunicera via bildtelefoni.

**Arbete och fritid.** Med TERA-Local följer du samtal i samma rum – med textstöd som underlättar i möten, butiker och vardagssituationer. Funktionen minskar hörselstress och kan komplettera läppavläsning.

För bättre ljud vid samtal i samma rum rekommenderas en extern mikrofon i miljöer med bakgrundsljud, sorl eller eko. Vi rekommenderar just nu Saramonic Blink 500 Pro – ett trådlöst mikrofonsystem som är enkelt att använda och ger klar och stabil ljudkvalitet.

## Teknisk information

### TERA-Mobile för iPhone

- Systemkrav: Senaste versionen av iOS
- Nedladdning: TERA-appen installeras på den iPhone som används för samtal
- Anslutning: WiFi eller SIM-kort
- Protokoll: SIP-baserad klient, kompatibel med större videokonferenssystem som Cisco och Polycom
- Rekommenderad hårdvara: iPhone 16 eller senare (krävs för full funktionalitet)
- Varseblivningsstöd: TM-Alert, Lidol VARSEBOX

### TERA-Mobile för Android

- Systemkrav: Minimum Android 12 (krävs för full funktionalitet)
- Anslutning: WiFi eller SIM-kort
- Protokoll: SIP-baserad klient, kompatibel med Cisco och Polycom
- Rekommenderad hårdvara: Samsung Galaxy S25 eller liknande
- Varseblivningsstöd: TM-Alert, Lidol VARSEBOX

### TERA-Touch för iPad

- Systemkrav: Senaste versionen av iPadOS
- Anslutning: WiFi eller SIM-kort
- Protokoll: SIP-baserad klient, kompatibel med Cisco och Polycom
- Rekommenderad hårdvara: iPad (10:e gen eller senare), iPad Air (7:e gen eller senare), iPad Pro (7:e gen eller senare)
- Varseblivningsstöd: TM-Alert, Lidol VARSEBOX

### TERA-Touch för Android Tablets

- Systemkrav: Minimum Android 12 (krävs för full funktionalitet)
- Anslutning: WiFi eller SIM-kort
- Protokoll: SIP-baserad klient, kompatibel med Cisco och Polycom
- Rekommenderad hårdvara: Galaxy Tab S10 eller liknande
- Varseblivningsstöd: TM-Alert, Lidol VARSEBOX`,
  },
  {
    slug: 'tm',
    shortDescription:
      'TM – Videomöten som passar alla. Kombinerar HD-video, realtidschatt och ljud för privat bruk och arbetsliv, med full tillgänglighet.',
    descriptionMd: `## Videomöten och samtal med full tillgänglighet

TM är en kommunikationslösning som kombinerar HD-video, realtidschatt och ljud – för både privat bruk och arbetsliv. TM visar det motparten skriver, tecken för tecken, direkt på skärmen och erbjuder anpassningsbara visuella inställningar, såsom färgkontrast och textstorlek.

Systemet är utvecklat för personer med funktionsnedsättning, men passar alla som vill ha tydlig och tillgänglig kommunikation på distans. TM finns för mobil, surfplatta och dator (PC/Mac), och varje version är optimerad för sin enhet. Alla TM-produkter är medicintekniska hjälpmedel klass I enligt MDR (EU 2017/745).

## TM-versioner

**TM-Touch (surfplatta).** Appen för surfplatta ger stor skärm, tydlig video och realtidschatt – perfekt för dig som vill läsa läppar, använda teckenspråk eller som har synnedsättning. Du kan kombinera TM-Touch med TM-Mobile och använda samma nummer på båda enheter.

**TM-Mobile (iOS).** TM för iPhone – flexibel, mobil och alltid nära till hands. Den smidiga versionen av TM-Touch, anpassad för dig som är på språng.

**TM-PC (Windows).** En stationär bild- och texttelefon för dig som arbetar vid dator eller använder synhjälpmedel. HD-video, punktskriftsstöd och multikörning gör den särskilt lämpad för dövblinda och hörselskadade. Finns även som flerpartsversion (TM-PC Flerpart).

**TM-Mac (macOS).** En bild- och texttelefon med stöd för teckenspråkstolkning och texttelefoni. All trafik är end-to-end-krypterad när det stöds, och multikörning gör det möjligt att jobba samtidigt som du är tillgänglig för samtal.

## Funktioner i TM-produkterna

### Användarvänlig design

- Tydligt gränssnitt med stora knappar, hög kontrast och anpassningsbar bakgrund
- Extra högt och klart ljud för att underlätta samtal
- Anpassningsbar för synnedsättning: välj färg och textstorlek. Kompatibel med synhjälpmedel och punktdisplay (PC)

### Full kommunikation – text, video & tal

- Totalkonversation: kombinera video, text och ljud i realtid
- Teckenspråk via video: ring andra bildtelefonanvändare eller tolktjänster
- Texttelefonläge: aktiveras enkelt i inställningar – stödjer även analog texttelefoni
- Realtidstextning: all text visas för mottagaren ord för ord i samtalet

### Smarta funktioner

- GPS-position: skicka din plats med ett klick (i mobil och surfplatta)
- Snabbval & nödnummer: ring favoriter eller 112 med ett tryck
- Automatiskt svar: missade samtal loggas och kan läsas i efterhand – helt utan extern svarstjänst

### Alltid nåbar med TM-Push

- Du är anträffbar även om appen inte är aktiv
- Välj "Stör ej" för tillfällig paus – aktiveras automatiskt igen efteråt
- Ger likvärdig tillgänglighet som vanlig telefoni – oavsett funktionsvariation

### Varseblivning

- Stöd för svenska varseblivningssystem som Bellman Symfon, Signolux, GN Resound och TM-Alert
- Fungerar även med nätverksbaserade system

## Standarder och kompatibilitet

TM-produkterna följer MFD:s definition av Totalkonversation, vilket innebär stöd för bildtelefon, texttelefon och möjlighet att kombinera tal, teckenspråk och skriven text i samma samtal.

- Stöd för realtidstext enligt RFC 4103/T.140
- Använder SIP-baserad realtidstext via "Reliable text"
- Bygger på T-Meetings egen teknik G.R.E.A.T som gör att TM automatiskt anpassar sig till motpartens textprotokoll
- SIP-baserad klient som kan delta i videokonferenser med system från t.ex. Cisco och Polycom, även i flerpartssamtal

## Systemkrav

### TM-PC – Windows

- Operativsystem: Windows 10 eller senare
- Processor: Intel Core i5 (10:e gen eller senare)
- Minne: minst 8 GB DDR4 (16 GB rekommenderas)
- Lagring: minst 256 GB SSD med minst 100 GB ledigt
- Skärm: minst 15 tum (16:9), upplösning minst 1366×768
- Webbkamera: inbyggd HD 1 MP eller extern Logitech HD Pro C920
- Varseblivning: Lidol VARSEBOX

### TM-Mac – macOS

- Operativsystem: macOS 15 eller senare
- Hårdvara: Mac med inbyggd kamera (t.ex. MacBook Air M3/M4, MacBook Pro M4)
- Skärm: minst 15 tum (16:9), upplösning minst 1366×768
- Varseblivning: Lidol VARSEBOX

### TM-Touch & TM-Mobile – iOS/iPadOS

- Operativsystem: senaste versionen av iPadOS / iOS
- Rekommenderad hårdvara: iPad (10:e gen+), iPad Air (7:e gen+), iPad Pro (7:e gen+), iPhone 16 eller senare
- Uppkoppling: WiFi eller SIM-kort
- Varseblivning: TM-Alert, Lidol VARSEBOX

### Android

- Operativsystem: senaste versionen av Android
- Rekommenderad hårdvara: Samsung Galaxy Tab S10/S11, Samsung Galaxy S25/S26
- Uppkoppling: WiFi eller SIM-kort
- Varseblivning: TM-Alert, Lidol VARSEBOX`,
  },
  {
    slug: 'tm-pc-flerpart',
    shortDescription:
      'TM-PC Flerpart – samtal där alla kan vara med. Samla flera personer i samma samtal via ljud, video eller text, med eller utan tolk.',
    descriptionMd: `## Samtal där alla kan vara med

Med TM-PC Flerpart kan du enkelt samla flera personer i samma samtal – oavsett om de använder vanlig telefon, bildtelefon eller behöver tolk. Du fungerar som samtalsvärd och kopplar in andra via ljud, video eller text.

Det gör det möjligt att t.ex. prata med en förälder, en god man och en teckenspråkstolk – samtidigt.

## Du kan till exempel

- Samla anhöriga, gode män och tolk i ett och samma samtal
- Ha distansmöten med flera deltagare i förening eller arbete
- Ringa från sjukhuset och koppla in tolk vid behov

De andra deltagarna kan använda telefon eller valfria lösningar som stöder Totalkonversation. Om någon använder TERA kan ni även använda talsyntes, video och textning.

## Se hur det fungerar i praktiken

Bara en av deltagarna behöver ha flerpartsfunktionen för att koppla ihop flera personer i ett samtal. En tolk kan exempelvis ringa upp för att underlätta ett snabbt samtal mellan en teckenspråkig person och någon som inte kan teckenspråk.`,
  },
  {
    slug: 'tm-alert',
    shortDescription:
      'TM-ALERT – vibration som gör skillnad. Bärbar enhet som via stark vibration, färgindikation och lång batteritid signalerar samtal, meddelanden och möten.',
    descriptionMd: `## Alltid nåbar när det gäller

TM-ALERT hjälper dig att slappna av och fokusera på nuet – samtidigt som du får en tydlig signal när något viktigt händer. Genom stark vibration, färgindikation och lång batteritid märker du direkt om någon ringer, skickar meddelanden eller om ett möte närmar sig.

Du väljer själv var du bär TM-ALERT: runt armen, i fickan eller under kudden. Den fungerar med både iPhone och Android, tillsammans med T-Meetings produkter och flera vanliga appar.

## Därför gillar många TM-ALERT

- Upp till en månads batteritid efter laddning
- Bluetooth för Android och iPhone
- Anpassningsbara färg- och vibrationsmönster
- Bär den på armen, i fickan eller under kudden
- Extra tydliga notiser från samtal, meddelanden, alarm m.m.
- Välj vilka appar och händelser som ska trigga en signal

## Känsla & funktion

- Flexibel: liten modul som kan bäras i armband, ficka eller ligga löst
- Anpassningsbar: välj armbandsfärg, ljusfärg och vibrationsstil
- Tydlig: blinkar i olika färger och vibrerar kraftigt
- Lång batteritid: laddas smidigt, håller i upp till 1 månad
- Trygg: vibrerar även om kopplingen till mobilen bryts

## Kompatibilitet & teknik

- Fungerar med både Android och iPhone
- Räckvidd: upp till 20 meter via Bluetooth
- Kompatibel med T-Meetings appar och andra
- Stöd för notiser från t.ex. telefonsamtal, videosamtal, sms, alarm (Android), Facebook, Messenger m.fl.
- Koppling till telefonens alarmfunktion möjlig
- Visuellt stöd: blinkar i sex olika färgkombinationer
- Vibrationsstöd: mönster med olika intensitet och längd

## Hur får jag TM-ALERT?

- **Via regionen:** I vissa regioner kan TM-ALERT förskrivas som hjälpmedel.
- **Via arbete:** Om du arbetar och redan använder, eller planerar att använda, ett kommunikationshjälpmedel kan du ansöka om TM-ALERT via Arbetsförmedlingen – som en del av ett paket tillsammans med någon av våra kommunikationslösningar, exempelvis TERA.
- **Köpa själv:** TM-ALERT finns att köpa via Infiniuum.

Vid frågor om förskrivning eller om du vill veta vad som gäller där du bor – kontakta oss gärna så hjälper vi dig vidare.`,
  },
];

export const services: RichItem[] = [
  {
    slug: 'distanstolken',
    shortDescription:
      'Distanstolken / TM-PC Pro – för tolkcentraler och organisationer. Distanstolkning och inkluderande distansmöten med upp till sex parter i video och tal.',
    descriptionMd: `## För vem?

### Tolkcentraler

Distanstolken / TM-PC Pro är designad för tolkcentraler och tolkbyråer som utför tolkuppdrag inom teckenspråks- och skrivtolkning. Med Distanstolken går det att välja om man utöver tolk-på-plats även vill kunna erbjuda distanstolkning. Distanstolkning innebär att tolken sitter på sitt kontor. På så sätt blir det ett bättre tolkutnyttjande, färre resor och möjlighet till distans i de fall det finns risk för smittspridning. Med Distanstolken går det att vara upp till sex parter i video och talsamtal utöver det.

### Företag och organisationer

Det går att använda Distanstolken även i andra sammanhang. Det kan vara organisationer som vill klara volontärverksamheter för döva, dövblinda, hörselskadade och andra; företag, skolor, utbildningscenter och studieförbund som vill vara inkluderande; eller de som vill ha mindre strul vid uppkoppling av distansmöten – med TM-PC Pro fungerar det direkt.

## Kom igång snabbt med öppen standard

Distanstolken/TM-PC Pro är det enklaste sättet att komma igång med tolkcentral och inkluderande distanskommunikation. När allt är installerat är det enkelt att snabbt ringa distanssamtal och sätta upp distansmöten.

TM-PC Pro följer den öppna standarden för Totalkonversation och fungerar tillsammans med kommersiella videotelefonilösningar som finns på företag idag. Det går också att ha videomöten med alla de som idag har video-/bildtelefoni förskrivet av Sveriges regioner. Med denna öppna standard kan alla ringa till varandra kors och tvärs.

## Hur distansmöten fungerar

Det går att mixa samtalstyper i konferensen/gruppsamtalet. Konferensdeltagare som endast använder röstsamtal kan delta samtidigt som andra som endast använder video eller realtidstext. Det gör att även personer som är döva, dövblinda eller hörselskadade kan delta i en mixad telefon- och videokonferens – via video, röst, realtidstext eller med hjälp av Braille (punktskrift).

TM-PC Pro-användaren, som kan vara en tolk eller operatör, har full kontroll över samtalet tack vare T-Meetings egenutvecklade Multi Conference Unit-lösning (MCU). Användargränssnittet är utvecklat i nära samarbete med tolkar och slutanvändare.

## Egenskaper

- Ring Direkt för telefoni
- Totalkonversation och realtidstext (kallas ibland alternativ telefoni)
- Konferens/gruppsamtal på distans
- Samtalskontroll: miniväxel
- Ring ut (tillval) och ring in
- Telefonsvarare
- Anpassning för teckenspråk (videoprioritet)
- Anpassning för synnedsättningar (färgkombinationer, storlek och size-up)
- Möjlighet att koppla in varseblivning som pager, blinklampor och TM-Alert
- Analys och uppföljning
- Integritet: krypterade samtal

## Användning

**Uppkoppling av samtal.** Man bjuder in deltagare till samtalet genom att ringa upp dem eller genom att de ringer in.

**Kontroll över samtal.** TM-PC Pro visar alltid tydligt vilka deltagare som är med i samtalet. Operatören kan välja om alla samtal ska kopplas ner eller endast vissa parter. TM-PC Pro kan även hantera tappade samtal och låta operatören ringa upp personen igen under pågående session.

**Konferens/gruppsamtal.** Operatören hanterar själv konferensen, upp till 6 deltagare. Ljud från deltagare som använder både SIP-standard och vanlig fast/mobiltelefoni (PSTN) stöds, så operatören fritt kan mixa deltagare i samma samtal.

**Telefonsvarare för alla format.** Man kan spela in videosvarsmeddelanden för inkommande samtal. Den inringande kan lämna meddelande som video, ljud eller text. Funktionen är inbyggd och allt sparas lokalt.

## Anpassningar

För döva med synnedsättning erbjuder TM-PC Pro goda möjligheter till synanpassningar: textfärg, textstorlek och bakgrundsfärg kan anpassas för önskad kontrast, med olika utseende för inkommande och egen text.

Dövblinda punktskriftsanvändare kan använda Braille vid samtal med tolk. TM-PC Pro lämnar automatiskt ett förinspelat välkomstmeddelande vid uppkoppling med realtidschatt, och utrustningen kopplas via bluetooth till Braille-displayen. Dövblinda som inte kan teckenspråk kan skriva till tolken i realtidschatten.

## Integritet

TM-PC Pro har möjlighet till sekretess vid användning av tonval för legitimering. När en döv kund slår in sin tonvalskod går signalen direkt till tjänsten utan att tolken uppfattar koden.

## Analys

Allt som händer kan spelas in om man vill – användbart för utbildning och dataanalys. Om funktionen inte är tillåten av lag- eller policyskäl kan den stängas av permanent.

## Standarder

- Följer MFD:s definition av Totalkonversation (bildtelefon och texttelefon, blandar teckenspråk, tal och skriven text)
- Stödjer världsstandarden för realtidstext RFC 4103/T.140 samt SIP-baserad realtidstext "Reliable text", möjligt tack vare T-Meetings protokoll G.R.E.A.T
- SIP-baserad klient som kan delta i videokonferens med system från Cisco och Polycom, även flerpart
- Norges nationella förmedlingstjänst för teckenspråk och texttelefoni använder TM-PC Pro i HD-kvalitet ner till 512 kbps bandbredd

## Systemkrav

- Operativsystem: Windows 10 eller senare
- Processor: Intel i5 eller bättre rekommenderas
- Kamera: Logitech C920 eller motsvarande rekommenderas
- Anslutning: nätverkskabel (Cat 5e eller bättre) eller Wi-Fi (802.11b/g/n)
- Protokoll över nät: HTTP (TCP 80), SIP (TCP/UDP 5060), RTP (dynamisk port)`,
  },
  {
    slug: 'ringdirekt-se',
    shortDescription:
      'Ring Direkt (SE) – ett eget mobilnummer där skriv- eller teckenspråkstolk kopplas in automatiskt i samtalet, redan innan mottagaren svarat.',
    descriptionMd: `## Hur fungerar Ring Direkt?

Med Ring Direkt får du ett eget mobilnummer. När du ringer kopplas en skrivtolk eller teckenspråkstolk automatiskt in – beroende på vad du behöver – redan innan den du ringer har svarat. Detsamma gäller när någon ringer dig: en tolk är alltid med i samtalet från start och tolkar det som sägs. Allt sker smidigt i ett enda steg.

Om mottagaren inte svarar, visas ditt nummer i hens nummerpresentation – precis som vid ett vanligt samtal – och personen kan ringa tillbaka senare.

> Tjänsten är för närvarande endast tillgänglig i Norge via NAV (Norwegian Labour and Welfare Administration).

## Hur får jag Ring Direkt?

(Gäller endast norska medborgare.)

Ring Direkt är en tilläggstjänst för dig som är yrkesverksam och använder en av T-Meetings bild- eller texttelefoner. Som norsk medborgare kan du ansöka om tjänsten via NAV Hjälpmedelscentral i det län där du bor.

Hörselskadade personer i arbetslivet har möjlighet att ansöka om flera olika kommunikationslösningar från T-Meeting – anpassade efter individuella behov.`,
  },
  {
    slug: 'ringdirekte',
    shortDescription:
      'Ring Direkte (NO) – eget norskt mobilnummer där samtal automatiskt går via skrive-/bildetolk vid NAV Hjelpemiddelsentral. Endast tillgänglig i Norge.',
    descriptionMd: `## Ring Direkte (NO)

> Ring Direkte er kun tilgjengelig for de som bor i Norge.

## Hvordan fungerer Ring Direkte?

Du får ditt eget norske mobilnummer. Når noen ringer deg, går samtalen automatisk via en skrivetolk og/eller bildetolk ved NAV Hjelpemiddelsentral. Det samme skjer når du ringer noen – da taster du personens vanlige telefonnummer og samtalen vil automatisk gå via en skrivetolk/bildetolk. Det vil si at alt skjer i ett trinn. Veldig praktisk.

Hvis den du ringer ikke svarer, kan han/hun se ditt telefonnummer i nummerpresentasjonen og ringe deg opp senere.

## Kommunikasjonsløsninger

Hørselshemmede som er i arbeid kan søke om kommunikasjonsløsninger fra T-Meeting:

- TM-Touch for nettbrett
- TM-Mobile for mobiltelefoner
- TM-PC for datamaskiner

Sammen med RING DIREKTE-tjenesten for skrivetolking fra NAV Hjelpemiddelsentral i det fylket hvor man hører til.`,
  },
  {
    slug: 'tillganglig-kundtjanst',
    shortDescription:
      'Tillgänglig Kundtjänst – en inkluderande kundtjänst för hörselskadade, döva och dövblinda, med AI-tolk för tal-till-text, talsyntes och teckenspråkstolk på distans.',
    descriptionMd: `## Tillgänglig Kundtjänst

Organisationer kan med Tillgänglig Kundtjänst erbjuda en delaktig entré och inkludering av även hörselskadade, döva eller dövblinda. Förutom vanliga call center-funktioner, tillgänglighetsanpassningar och video erbjuder Tillgänglig Kundtjänst en rad funktioner: en automatisk AI-tolk för tal-till-text, talsyntes samt möjlighet att koppla upp sig till teckenspråkstolk på distans.

Tillgänglig Kundtjänst gör att nya grupper kan arbeta i kundtjänst. Teckenspråkiga kan på detta sätt ge rådgivning eller samhällsservice åt andra teckenspråkiga. Detta kan i sin tur göra tjänsten smartare eftersom de med mest kunskap kan hjälpa andra i samma situation.

## Fördelar

- Kunden i centrum oavsett funktion
- Full nåbarhet både inifrån och ut samt utifrån och in
- Kö- och faktureringsfunktion
- Synanpassning är möjligt
- Tillgängliga videomöten på distans där de som ringer in kan använda en mix av vanliga talsamtal, texttelefoni, bildtelefoni och videokonferens
- Alternativ telefoni-lösning som ger åtkomst till nationell tolkservice som bildtelefoni och texttelefoni, vilka erbjuds av PTS – Post och Telestyrelsen`,
  },
];
