## Oppgave for NAV IT

Dette er min besvarelse på en kodeoppgave gitt av NAV IT i forbindelse opptak for sommerjobb 2021. Ettersom oppgaven var av relativt enkel art, og kun hadde bestått av én klasse med main ved bruk av Java, valgte jeg å skrive den i Javascript for å få inn litt UI. Ville også vise at jeg mestrer React, et populært rammeverk for systemutvikling på web. Det stod oppført i oppgaven at det ikke var krav om UI, men jeg ønsket vise mine styrker, og jeg synes dette gjorde oppgaven mer morsom å jobbe med.

De tre filene jeg selv har skrevet med unntak av package.json (kun endret), er App.js, App.scss og App.test.js. Selve metoden for utregning av dagpenger ligger i App.js kalt "calculateUnemploymentBenefits". Denne blir kjørt av enten å trykke på enter eller den dedikerte knappen på siden. Viser så dagpengesatsen og dagpengegrunnlag dersom riktig input er gitt.

I tillegg har jeg laget 4 tester som sjekker:

- Om input er riktig, alle tre boksene skal inneholde gyldige tall.
- Om eksempelet gitt i oppgavebeskrivelsen gir ut riktig dagpengesats.
- Om den blir begrenset til 6G dersom lønnen er høyere enn dette.
- Om den velger den høyeste verdien av gjennomsnittslønn og siste kalenderår.

#### Kjøring av koden

For å kjøre programmet kan man laste ned prosjektet, og kjøre `npm start`. For dette må man også kjøre `npm install` først ettersom node_modules ikke ligger på GitHub. Så kan man åpne [http://localhost:3000](http://localhost:3000) og teste applikasjonen her. Jeg har også valgt å deploye den på [GitHub Pages](https://martinnilsen99.github.io/dagpengerkalkulatorNAV/), både for å vise at jeg mestrer deploying, men også for å gjøre det enklere å teste for dere. Det er også litt kult å kunne teste den på mobil.

For å kjøre testene kan man kjøre `npm test`. Kan være man må trykke på `a` for å kjøre alle testene.
