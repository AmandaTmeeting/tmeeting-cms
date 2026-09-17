# Innehållsguide — produkter i Strapi

Kort guide för att lägga till och redigera produkter på tmeeting.se. Allt nedan görs
i Strapi-adminen; ingen utvecklare behövs. **Ändringar syns på webbplatsen inom
några sekunder efter att du klickat Publish.**

## Så styr du vad som visas under Privat och Företag

Varje produkt har ett fält som heter **Segment**. Det avgör på vilken sida produkten
dyker upp:

| Segment | Visas på |
|---|---|
| `PRIVAT` | `/produkter/privat` |
| `FORETAG` | `/produkter/foretag` |
| `BOTH` | båda sidorna |
| *(tomt)* | ingen av sidorna — produktsidan finns kvar, men den listas inte |

Vill du dölja en produkt från listorna utan att radera något: **töm Segment-fältet**
och publicera. Det går att ångra när som helst.

## Lägga till en ny produkt eller kategori under Företag

1. **Content Manager → Product → Create new entry**
2. Fyll i:
   - **Name** — namnet som visas på kortet och som sidrubrik.
   - **Slug** — fylls i automatiskt från namnet. Se *Reserverade slugs* nedan.
   - **Short description** — den korta texten på kortet i listan. Utan den blir
     kortet tomt under rubriken.
   - **Description** — brödtexten på själva produktsidan. **Utan den blir
     produktsidan i praktiken tom** (bara bild och kontaktruta).
   - **Card image** — bilden på kortet i listan. Utan bild visas en platshållare.
   - **Hero image** — den stora bilden högst upp på produktsidan.
   - **Segment** — sätt till `FORETAG`.
   - **Display order** — styr ordningen i listan, lägst först. Använd gärna
     tiotal (10, 20, 30 …) så går det att skjuta in en produkt emellan senare
     utan att numrera om allt.
3. **Save**, sedan **Publish**. Utan Publish syns ingenting på webbplatsen.

Produkten får automatiskt en egen sida på `/produkter/<slug>`, och kortet i listan
länkar dit.

## Reserverade slugs

Tre slugs fungerar inte, eftersom de krockar med adresser som redan finns:

- **`privat`** och **`foretag`** — de är själva listsidorna. Ett kort med den
  sluggen skulle länka tillbaka till listan den står i.
- **Allt som slutar på `-no`** (t.ex. `tera-no`) — sådana adresser skickas
  vidare till varianten utan `-no`, så sidan går inte att nå.

## Rubriker och texter på listsidorna

**Content Manager → Single Types → Produkter Page** innehåller:

- `heroH1`, `heroLead` samt Privat-/Företag-korten — allt på `/produkter`.
- `privatH1`, `privatLead` — rubrik och ingress på `/produkter/privat`.
- `foretagH1`, `foretagLead` — rubrik och ingress på `/produkter/foretag`.
- `privatEmptyText`, `foretagEmptyText` — texten som visas om listan är tom,
  t.ex. innan företagsprodukterna är publicerade.

Lämnar du ett fält tomt används en inbyggd standardtext.

## Länkarna i sidfoten

Sidfotens länkar ligger i **Single Types → Footer**, inte i koden. Kolumnen
"Produkter" pekar i dag bland annat på `/produkter/tm-pc-flerpart`, en produkt
som inte finns i Strapi — den länken ger 404 och bör rättas eller tas bort där.

Menyn högst upp går däremot alltid till `/produkter/privat` och
`/produkter/foretag`, så den behöver inte uppdateras när du lägger till en produkt.
