# wikimedia-eventstream-viewer

CLI tool for listening to the eventstream and filtering out keywords

# todo

- lets get filter labels for any language from wikidata
- support selecting specific json properties?
## Install

```bash
npm install
npm run start
```

Filtering on russia / ukraine on recent_changes events

The upper table is filter hits, the lower part is latest events.

```
✅
Domain                  Time                    User                   Title
commons.wikimedia.org   21:57:36                SchlurcherBot          File:Balashov, Saratov Oblast, Russia - panoramio (1).jpg
de.wikipedia.org        21:57:33                Bormaschine            Serhiy Kot
en.wikipedia.org        21:57:32                Simeon                 Irina Brazgovka
en.wikipedia.orga.org   21:57:12                SimeoncherBot          Zoya Buryakov, Saratov Oblast, Russia - panoramio.jpg
de.wikipedia.org        21:56:59                Sigma^2                Sanktionen gegen Russland seit dem Überfall auf die Ukraine
en.wikipedia.org        21:57:06                Simeon                 Maya Bulgakova
commons.wikimedia.org   21:57:06                SchlurcherBot          File:Balashikha, Moscow Oblast, Russia - panoramio.jpg
en.wikipedia.org        21:56:56                Simeon                 Alla Budnitskaya
en.wikipedia.org        21:56:34                2001:F73:1100:100:E554:French invasion of Russia
                                                2068:E56E:A529
en.wikipedia.org        21:56:20                Loveoflanguage         Category:CS1 errors: extra text: edition
en.wikipedia.org        21:56:20                Loveoflanguage         Republics of Russia
en.wikipedia.org        21:56:11                Simeon                 Inna Churikova


Domain                  Events                  Last user              Last title
en.wikipedia.org        326                     American Money         Category:Polish emigrants to Brazil
www.wikidata.org        1406                    YoaR                   Q63205370
zh.wikipedia.org        14                      Bigbullfrog1996        拉沙佩勒圣梅曼
fr.wikipedia.org        368                     NeoBot                 Catégorie:Éducation à Gand
ar.wikipedia.orga.org   412                     JarBotplitterBot       ذو الجوشنAll media needing categories as of 2022
de.wikipedia.org        32                      Bert.Kilanowski        Kategorie:Beschränkter Stoff nach REACH-Anhang XVII, Eintrag 29
ko.wikipedia.org        26                      Choboty                분류:낮음 중요도 음식과 음료 문서
ru.wikipedia.org        39                      Андрей Перцев          Яковлева, Александра Евгеньевна (актриса)
pl.wikipedia.org        13                      Emptywords             Jezioro Lubieńskie Małe
es.wikipedia.org        43                      Rexmania               Usuario discusión:Elqhathu
nl.wikipedia.org        40                      TijnM                  7 december
ca.wikipedia.org        32                      PereBot                Categoria:Escriptors francesos en francès
ceb.wikipedia.org       13                      Lsjbot                 Mont Pakesié Bepo
eu.wikipedia.org        1                       AmaiaRuiz              Añorbe
uk.wikipedia.orgg       28                      85.105.0.146           Русский военный корабль, иди на хуй
simple.wikipedia.org    7                       2A02:21B0:644C:7E57:6DBCategory:Communes in Doubs
                                                5:FD22:F5B4:8D06
bg.wikipedia.org        3                       Zelenkroki             Категория:Статии без посочени източници
sq.wikipedia.org        8                       Klein Muçi             Dita Botërore e Lirisë së Shtypit

```