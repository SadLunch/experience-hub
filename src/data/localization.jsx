const text = {
    "en": {
        global: {
            back: "← Back",
            title: "J-U-S-T-I-Ç-A À CHIADO",
        },
        aboutUsScreen: {
            artist: "Ana Fonseca",
            partnership: "FCUL Partnership",
            partnershipFull: "Partnership with Faculdade de Ciências da Universidade de Lisboa",
            artistBio: "Ana Fonseca (São Paulo, Brazil, 1978) lives and works in Lisbon. Visual artist. She graduated from Middlesex University, London (2003), and studied at Chelsea College of Arts Foundation in Art and Design, London (1999-00).\nA visual artist whose multidisciplinary practice almost always takes drawing as its starting point.\nFocusing on the sociological, psychological, and historical paradigms that have marked or mark the places she has been to (the “old” world and the “new” world), her records and sketches interconnect them in an anachronistic way, revealing a humor that is evident in all her works.",
            partnershipText: "This work is the result of a partnership between the Faculdade de Ciências da Universidade de Lisboa (FCUL), the LASIGE Research Laboratory, and visual artist Ana Fonseca, who have been collaborating since 2021 on projects that explore the application of augmented reality in the context of contemporary art."
        },
        firstScreen: {
            title: "J-U-S-T-I-Ç-A À CHIADO",
            btnIntroduction: "Introduction",
            introductionMessage1: "J-u-s-t-i-ç-a à Chiado is based on the premise that the place of justice is Ubiquitous (everywhere at the same time).",
            introductionMessage2: "We explored Chiado under the sign of Justice, mixing the history of the city with concepts of the construction and application of Justice.",
            introductionMessage3: "Explore Chiado by following the map and clicking on the icons to carry out the different experiences.",
            next: "Next",
            map: "Map",
            aboutUs: "About Us",
            back: "Back",
            readyQuestion: "Are you ready?",
            btnReady: "Yes",
            btnNotReady: "No"
        },
        mapScreen: {
            btnClose: "Close",
            participants: "Participants",
            btnExperienceDetail: "View Experience"
        },
        detailScreen: {
            experienceStartExp: "Start",
            easy: "Easy",
            hard: "Hard",
            attributions: "Attributions"
        },
        experiences: {
            "whac-a-mole": {
                title: "Reprovação ética",
                description: `It was here in Largo do Carmo, in 1974, that the dictatorship in Portugal fell.  The April revolutionaries of the MFA defeated the Estado Novo regime with the surrender of Marcelo Caetano, who was here in this barracks.\nFreedom was an achievement. Watch out for anti-democratic signs, they can appear where you least expect them, even in the place where democracy was born! \nTransform Nazi salutes quickly with the help of the hammer (judicial hammer) and watch a beautiful flower appear in its place. Through the application of justice, tolerance and peace are built.`,
                instructions: [
                    "Look around and find the hammer.",
                    "Drag the hammer and drop it in front of the salute to hit it.",
                    "Well done!",
                    [
                        "Now you're ready.",
                        "Click on the screen to start the game.",
                    ],
                    
                ],
                points: "Score",
                timeLeft: "Time Left",
                endSession: "Leave",
            },
            "gremio-lit": {
                title: "Grémio Literário",
                description: `A private club dedicated to culture and critical thinking. An important landmark for Portuguese culture, where the great writers of the 19th and 20th centuries met. A place for the dissemination of ideas and ideals that is still in operation and with cultural activity.\nIf we don't think about Justice, someone else will think for us! What kind of justice do we want for ourselves? And for future generations?\nArtists, philosophers, writers played a fundamental role in reflecting on Justice.\nIn order to be strong, Justice needs thought, but it also needs emotions. In order to be fair, it has to keep up with the times and be attentive, it can't waver!\nAre you ready to contribute to strong Justice? In the end, you'll get a reward! \nLead the lady of justice down the path where she'll find symbols of knowledge and feelings. Be quick if you want to win!`,
                instructions: [
                    "Look around and find the statue of Justice in the starting point.",
                    "Drag the statue along the blue path to the top.",
                    "To win, you have to get ideals (light bulbs) and emotions (hearts).",
                    "Be careful with skulls. They take away your emotions.",
                    "If the skulls hit you when you have no emotions, you lose the game.",
                    [
                        "Good luck!",
                        "Let's start",
                    ],
                ],
                instructionTitle: "Game Instructions:",
                alignScene: "Align",
                winMessage: "🎉 You Won! 🎉",
                explore: "Explore More",
                clickAndFindMessage: "Click to find out!",
                gameOver: "Game Over!",
                tryAgain: "Try Again",
                extraFaceDescriptionMaxPoints: "Congratulations! You’ve discovered all the paintings in this experience.",
                extraFaceDescriptionNotMaxPoints: "That's not all — there are more paintings waiting for you! Try the experiment again and you might find some more.",
            },
            "graffiti-1": {
                title: " As sufragistas#1",
                description: `Where are the women in Chiado?\nIs there a street dedicated to the memory of a feminist?\nAs there isn't one, let's put the women on the street! \nDiscover two great feminists from the First Republic.\n Rua Serpa Pinto has a dark history, with a famous murder during the First Republic and repression during the Estado Novo dictatorship.\nRemembering two women who dedicated their lives to women's rights on this street seems perfect, don't you think?`,
                instructionsHard: [
                    "Look around and find the spray paint can.",
                    "Touch and hold the spray paint can with one finger. When you look around, it will point in the direction of your gaze.",
                    "When you see a semi-transparent sphere, touch the screen with another finger to start spray-painting.",
                    "As you paint the graffiti, the progress bar at the bottom fills up.",
                    "When you have painted most of the graffiti, you can click on the progress bar to find out more about the person depicted in the graffiti.",
                    "Have fun!",
                ],
                instructionsEasy: [
                    "Look around and find the spray paint can.",
                    "Touch the spray paint can once to grab it - you don't need to keep your finger on the screen.",
                    "When you look around, it will point in the direction of your gaze.",
                    "Then, when you see a semi-transparent sphere, touch and hold (with the same finger or another) to start spray-painting.",
                    "As you paint the graffiti, the progress bar at the bottom fills up.",
                    "When you have painted most of the graffiti, you can click on the progress bar to find out more about the person depicted in the graffiti.",
                    "Have fun!",
                ],
                moreAbout: "Learm more",
            },
            "graffiti-2": {
                title: " As sufragistas#2",
                description: `Where are the women in Chiado?\nIs there a street dedicated to the memory of a feminist?\nAs there isn't one, let's put the women on the street! \nDiscover two great feminists from the First Republic.\n Rua Serpa Pinto has a dark history, with a famous murder during the First Republic and repression during the Estado Novo dictatorship.\nRemembering two women who dedicated their lives to women's rights on this street seems perfect, don't you think?`,
                instructionsHard: [
                    "Look around and find the spray paint can.",
                    "Touch and hold the spray paint can with one finger. When you look around, it will point in the direction of your gaze.",
                    "When you see a semi-transparent sphere, touch the screen with another finger to start spray-painting.",
                    "As you paint the graffiti, the progress bar at the bottom fills up.",
                    "When you have painted most of the graffiti, you can click on the progress bar to find out more about the person depicted in the graffiti.",
                    "Have fun!",
                ],
                instructionsEasy: [
                    "Look around and find the spray paint can.",
                    "Touch the spray paint can once to grab it - you don't need to keep your finger on the screen.",
                    "When you look around, it will point in the direction of your gaze.",
                    "Then, when you see a semi-transparent sphere, touch and hold (with the same finger or another) to start spray-painting.",
                    "As you paint the graffiti, the progress bar at the bottom fills up.",
                    "When you have painted most of the graffiti, you can click on the progress bar to find out more about the person depicted in the graffiti.",
                    "Have fun!",
                ],
                moreAbout: "Learm more",
            },
            "justica-monstro": {
                title: "Justiça Monstro",
                description: `Rua Nova do Almada is one of the arteries of Chiado, a wide and imposing street. It is also where the old Tribunal da Boa Hora is located, with a dark history of violations of fundamental rights and expression during the dictatorship.\nWho is afraid of justice? Who likes going to court? Who understands the penal code?\nJustice can be a monster, and the idea of justice, if based on punishment and control of citizens, can be a destructive force for freedom and rights, even fundamental ones. How is our current justice system?`,
                alignScene: "Align",
                finalText1: '"Justice is the first virtue of social institutions, as truth is of systems of thought. A theory however elegant and economical must be rejected or revised if it is untrue; likewise laws and institutions no matter how efficient and well-arranged must be reformed or abolished if they are unjust." — A Theory of Justice',
                finalText2: 'John Rawls'
            },
            "selfie": {
                title: "Je suis la Justice",
                description: `Now closed, it was one of the main courts in the Lisbon district and the scene of many controversial cases in Portugal's recent history. Of particular note were the Estado Novo cases against freedom of expression and cultural production.\nWho is Justice? It's all of us!\nWe are all agents of Justice, with ourselves and with others, whether in person, online or in all temporal dimensions.\nInspired by the French “Je suis Charlie” movement. It started out as a slogan and logo created by French art director Joachim Roncin [fr] and adopted by supporters of freedom of expression and freedom of the press after the shooting on January 7, 2015, in which twelve people were killed at the offices of the French satirical weekly Charlie Hebdo.\nWith Justice on your mind, take a selfie and share this experience of Justice with whoever you want! Be Justice, always and everywhere!!!`,
                takePhoto: "Click to take photo",
            },
        },
        graffitiPos: {
            "graffiti-1": {
                title: "Adelaide Cabete",
                imageAlt: "Full Graffiti",
                dob: "January 25th, 1867",
                dod: "September 14, 1935",
                imageDesc: 'Adelaide Cabete - "Não se assustem...porque nós  caminhamos para a Justiça, para a Verdade, para a Luz, para o Direito Humano"',
                description: "Adelaide Cabete (1867-1935) was one of the most influential Portuguese feminists and republicans of the early 20th century. Born in Elvas, of humble origins, she worked from an early age to help her family, but with the support of her husband, Manuel Cabete, she managed to study and graduate in Medicine in 1900, becoming the third woman doctor in Portugal. Her thesis, A Proteção às Mulheres Grávidas Pobres, already revealed her commitment to social justice and women's rights, proposing pioneering measures such as maternity leave and state support for disadvantaged mothers.\nHer feminist activism was intense and multifaceted. She founded and chaired the National Council of Portuguese Women for over two decades, leading initiatives such as the Feminist and Education Congress (1924), where she presented proposals on childcare, feminine hygiene and combating alcoholism in schools. She defended women's suffrage, sex education, child protection and the dignity of women in all spheres of life. She was also the director of the magazine Alma Feminina, where she disseminated progressive and humanist ideas.\nA staunch Republican, she took an active part in the establishment of the Republic in 1910, having embroidered flags to be flown in Lisbon. Disillusioned with the country's political direction, especially with the rise of the Estado Novo, she moved to Angola in 1929, where she continued to practice medicine and fight for the rights of the most vulnerable. In 1933, she became the first and only woman to vote in Luanda under the new Constitution, in a symbolic gesture of resistance and affirmation.",
            },
            "graffiti-2": {
                title: "Ana de Castro Osório",
                imageAlt: "Full Graffiti",
                dob: "June 18th, 1872",
                dod: "March 23, 1935",
                imageDesc: 'Ana de Castro Osório  -" Ser feminista é  apenas ser justo e ser logico"',
                description: `Ana de Castro Osório (1872-1935) was one of the most striking figures of feminism and republicanism in Portugal. Born in Mangualde, she grew up in a cultured and progressive family environment, which allowed her to develop a critical awareness and a passion for writing from an early age. She became a pioneer of Portuguese children's literature, creating the collection Para as Crianças and dedicating herself to literacy as an instrument of emancipation. She believed that education was the key to transforming society and freeing women from the legal and social subordination they faced at the beginning of the 20th century.\nHer feminist activism gained momentum with the publication, in 1905, of the manifesto Às Mulheres Portuguesas, considered the first Portuguese feminist manifesto. Ana founded and led several organizations, such as the Portuguese Group of Feminist Studies (1907), the Republican League of Portuguese Women (1909) and the Feminist Propaganda Association (1912), which was part of the International Women Suffrage Alliance. She defended women's right to vote, to education, to work and to economic independence, and collaborated with Afonso Costa in drafting the Divorce Law of 1910, one of the First Republic's first achievements in the field of civil rights.\nA staunch Republican, Ana de Castro Osório believed that the Republic should serve women and not the other way around. Despite her disillusionment with the direction of the Republic, she remained faithful to the ideals of justice and equality, dedicating herself to writing and social action.`,
            }
        },
        gremioLitFaces: [
            { img: "/images/256px-AlexandreHerculano.png", name: "Alexandre Herculano (1810 - 1877)", description: "" },
            { img: "/images/256px-Almeida_Garrett_por_Guglielmi.jpg", name: "Almeida Garrett (1799 - 1854)", description: "" },
            { img: "/images/256px-Rebello_da_Silva_-_Serões_(Abr1907).png", name: "Rebelo da Silva (1822 - 1871)", description: "" },
            { img: "/images/256px-José_da_Silva_Mendes_Leal.png", name: "Mendes Leal (1820 - 1886)", description: "" },
            { img: "/images/256px-Anselmo_José_Braamcamp,_1887_(London,_Maclure_&_Co.).png", name: "Anselmo Braamcamp (1817 - 1885)", description: "" },
            { img: "/images/Rodrigo_da_Fonseca_Magalhães_(Grémio_Literário).png", name: "Rodrigo da Fonseca (1787 - 1858)", description: "" },
            { img: "/images/256px-António_Maria_de_Fontes_Pereira_de_Melo,_1883.png", name: "Fontes Pereira de Melo (1819 - 1887)", description: "" },
            { img: "/images/António_Rodrigues_Sampaio_(1806-1882).png", name: "Rodrigues Sampaio (1806 - 1882)", description: "" },
            { img: "/images/Retrato_do_Marquês_de_Sá_da_Bandeira_-_Academia_Militar.png", name: "Sá da Bandeira (1795 - 1876)", description: ""}
        ],
    },
    "pt": {
        global: {
            back: "← Voltar",
            title: "J-U-S-T-I-Ç-A À CHIADO",
        },
        aboutUsScreen: {
            artist: "Ana Fonseca",
            partnership: "Parceria FCUL",
            partnershipFull: "Parceria Faculdade de Ciências da Universidade de Lisboa",
            artistBio: "Ana Fonseca (São Paulo, Brasil, 1978) vive e trabalha em Lisboa. Artista visual. Licenciou-se na Middlesex University, Londres (2003), estudou na Chelsea College of Arts Foundation in Art and Design, Londres (1999-00).\nArtista plástica cuja prática multidisciplinar tem quase sempre como ponto de partida o desenho.\nDebruçando-se sobre os paradigmas sociológicos, psicológicos e históricos que marcaram ou marcam os locais por onde tem passado (“velho” mundo e “novo” mundo), o registo e o traço interliga-os de forma anacrónica, transparecendo um humor que é patente em todas as suas obras.",
            partnershipText: "Este trabalho é fruto da parceria entre a Faculdade de Ciências da Universidade de Lisboa (FCUL), Laboratório de Investigação LASIGE e a artista visual Ana Fonseca, que desde 2021 colaboram no desenvolvimento de projetos que exploram a aplicação de realidade aumentada no contexto da arte contemporânea."
        },
        firstScreen: {
            title: "J-U-S-T-I-Ç-A À CHIADO",
            btnIntroduction: "Introduction",
            introductionMessage1: "J-u-s-t-i-ç-a à Chiado tem como premissa que o lugar da justiça é Ubíquo (em toda a parte ao mesmo tempo).",
            introductionMessage2: "Exploramos o Chiado sobre o signo da Justiça, misturando a história da cidade, com conceitos de construção e aplicação da Justiça.",
            introductionMessage3: "Explore o Chiado seguindo o mapa e carregue nos ícones para realizar as diferentes experiências. ",
            next: "Avançar",
            map: "Mapa",
            aboutUs: "Sobre Nós",
            back: "Voltar",
            readyQuestion: "Está preparado(a)?",
            btnReady: "Sim",
            btnNotReady: "Não"
        },
        mapScreen: {
            btnClose: "Fechar",
            participants: "Participantes",
            btnExperienceDetail: "Ver Experiência"
        },
        detailScreen: {
            experienceStartExp: "Começar",
            easy: "Fácil",
            hard: "Difícil",
            attributions: "Créditos"
        },
        experiences: {
            "whac-a-mole": {
                title: "Reprovação ética",
                description: `Foi aqui no Largo do Carmo, em 1974, que a ditadura em Portugal caiu.  Os revolucionários de Abril do MFA venceram o regime do Estado Novo, com a rendição de Marcelo Caetano que se encontrava aqui neste quartel.\nA liberdade foi uma conquista. Esteja atento aos sinais antidemocráticos, eles podem surgir onde menos se espera, mesmo no lugar onde nasceu a democracia!\nTransforme as saudações nazi rapidamente com a ajuda do martelo (martelo judicial) e veja aparecer uma linda flor no seu lugar. Através da aplicação da justiça, constrói-se a tolerância e a paz.`,
                instructions: [
                    "Olha em volte e encontra o martelo.",
                    "Arrasta o martelo e larga-o em frente à saudação para acertar nela.",
                    "Bom trabalho!",
                    [
                        "Agora estás preparado.",
                        "Clica no ecrã para começares o jogo.",
                    ],
                    
                ],
                points: "Pontos",
                timeLeft: "Tempo restante",
                endSession: "Sair",
            },
            "gremio-lit": {
                title: "Grémio Literário",
                description: `Clube privado dedicado à cultura e pensamento crítico. Um marco importante para a cultura portuguesa, onde os grandes escritores do século XIX e XX se reuniam. Um local de difusão de ideias e ideais ainda em funcionamento e com atividade cultural.\nSe não pensarmos sobre a Justiça, alguém pensará por nós! Que Justiça queremos para nós? E para as gerações vindouras?\nArtistas, filósofos, escritores tiveram um papel fundamental para a reflexão sobre a Justiça.\nA Justiça para ser forte precisa de pensamento, mas também de sentimentos para ser justa, tem de acompanhar os tempos e estar atenta, não pode vacilar!\nEstá pronto para contribuir para uma justiça forte? No fim, terá uma recompensa!\nLeve a senhora da justiça a percorrer o caminho onde encontrará símbolos de conhecimento e sentimentos. Seja célere, se quiser ganhar!`,
                instructions: [
                    "Olhe em volta e encontre a estátua da Justiça na casa de partida.",
                    "Arraste a estátua pelo caminho azul até ao topo.",
                    "Para ganhare tem de obter ideais (lâmpadas) e emoções (corações).",
                    "Tenha cuidado com as caveiras. Elas tiram-lhe emoções.",
                    "Se as caveiras lhe acertarem quando não tem emoções, perde o jogo.",
                    [
                        "Boa sorte!",
                        "Vamos Começar",
                    ],
                ],
                instructionTitle: "Instruções do Jogo:",
                alignScene: "Alinhar",
                winMessage: "🎉 Ganhou! 🎉",
                explore: "Explore Mais",
                clickAndFindMessage: "Clique e Descubra!",
                gameOver: "Game Over!",
                tryAgain: "Tentar novamente",
                extraFaceDescriptionMaxPoints: "Parabéns! Já descobriu todas as pinturas desta experiência.",
                extraFaceDescriptionNotMaxPoints: "Isto não é tudo — há mais pinturas à espera! Volte a fazer a experiência e pode ser que encontre outras.",
            },
            "graffiti-1": {
                title: " As sufragistas#1",
                description: `Onde estão as mulheres no Chiado?\nHá alguma rua dedicada à memória de alguma feminista?\nComo não há, vamos colocar as mulheres na rua!\nDescubra duas grandes feministas da 1ª república.\nA Rua Serpa Pinto tem uma história negra, com um famoso assassinato durante a primeira república e de repressão durante a ditadura do estado novo.\nRelembrar duas mulheres que dedicaram a sua vida aos direitos das mulheres nesta rua parece perfeito, não acha?`,
                instructionsHard: [
                    "Olhe em volta e encontre a lata de tinta spray.",
                    "Toca e segura com um dedo para agarrares a lata de tinta spray. Quando olhares em volta, ela vai apontar na direção do teu olhar.",
                    "Quando vires uma esfera semi-transparente, toca no ecrã com outro dedo para começares a pintar com tinta spray.",
                    "Enquanto pintas o graffiti, a barra de progresso em baixo vai-se preenchendo.",
                    "Quando tiveres pintado a maior parte do graffiti, podes clicar na barra de progresso para saber mais sobre a pessoa retratada no graffiti.",
                    "Diverte-te!",
                ],
                instructionsEasy: [
                    "Olhe em volta e encontre a lata de tinta spray.",
                    "Toque uma vez na lata de tinta spray para a agarrar — não precisa de manter o dedo no ecrã.",
                    "Quando olhar em volta, ela vai apontar na direção do seu olhar.",
                    "Depois, quando vir uma esfera semi-transparente, toque e segure (com o mesmo dedo ou outro) para começar a pintar com tinta spray.",
                    "Enquanto pinta o graffiti, a barra de progresso em baixo vai-se preenchendo.",
                    "Quando tiver pintado a maior parte do graffiti, pode clicar na barra de progresso para saber mais sobre a pessoa retratada no graffiti.",
                    "Divirta-se!",
                ],
                moreAbout: "Saber Mais",
            },
            "graffiti-2": {
                title: " As sufragistas#2",
                description: `Onde estão as mulheres no Chiado?\nHá alguma rua dedicada à memória de alguma feminista?\nComo não há, vamos colocar as mulheres na rua!\nDescubra duas grandes feministas da 1ª república.\nA Rua Serpa Pinto tem uma história negra, com um famoso assassinato durante a primeira república e de repressão durante a ditadura do estado novo.\nRelembrar duas mulheres que dedicaram a sua vida aos direitos das mulheres nesta rua parece perfeito, não acha?`,
                instructionsHard: [
                    "Olha em volta e encontra a lata de tinta spray.",
                    "Toca e segura com um dedo para agarrares a lata de tinta spray. Quando olhares em volta, ela vai apontar na direção do teu olhar.",
                    "Quando vires uma esfera semi-transparente, toca no ecrã com outro dedo para começares a pintar com tinta spray.",
                    "Enquanto pintas o graffiti, a barra de progresso em baixo vai-se preenchendo.",
                    "Quando tiveres pintado a maior parte do graffiti, podes clicar na barra de progresso para saber mais sobre a pessoa retratada no graffiti.",
                    "Diverte-te!",
                ],
                instructionsEasy: [
                    "Olhe em volta e encontre a lata de tinta spray.",
                    "Toque uma vez na lata de tinta spray para a agarrar — não precisa de manter o dedo no ecrã.",
                    "Quando olhar em volta, ela vai apontar na direção do seu olhar.",
                    "Depois, quando vir uma esfera semi-transparente, toque e segure (com o mesmo dedo ou outro) para começar a pintar com tinta spray.",
                    "Enquanto pinta o graffiti, a barra de progresso em baixo vai-se preenchendo.",
                    "Quando tiver pintado a maior parte do graffiti, pode clicar na barra de progresso para saber mais sobre a pessoa retratada no graffiti.",
                    "Divirta-se!",
                ],
                moreAbout: "Saber Mais",
            },
            "justica-monstro": {
                title: "Justiça Monstro",
                description: `A Rua Nova do Almada é uma das artérias do Chiado, rua larga e imponente é também aí que se encontra o antigo Tribunal da Boa Hora, com uma história negra de infrações dos direitos fundamentais e de expressão durante a ditadura.\nQuem tem medo da Justiça? Quem gosta de ir a tribunal? Quem percebe o código penal?\nA Justiça pode ser um monstro, e a ideia de Justiça se for baseada na punição e no controlo dos cidadãos poderá ser uma força destruidora da liberdade e dos direitos, mesmo dos fundamentais. A nossa Justiça atual, como é?`,
                alignScene: "Alinhar",
                finalText1: '"A justiça é a primeira virtude das instituições sociais, assim como a verdade é a dos sistemas de pensamento. Uma teoria, por mais elegante e econômica que seja, deve ser rejeitada ou revisada se não for verdadeira; da mesma forma, leis e instituições, por mais eficientes e bem-organizadas que sejam, devem ser reformadas ou abolidas se forem injustas." — Uma Teoria da Justiça',
                finalText2: 'John Rawls'
            },
            "selfie": {
                title: "Je suis la Justice",
                description: `Tribunal atualmente desativado, foi um dos principais tribunais da comarca de Lisboa e palco de muitos processos polémicos da história recente de Portugal. Destacando os processos do estado novo contra a liberdade de expressão e produção cultural.\nQuem é Justiça? Somos todos nós!\nTodos nós somos agentes de Justiça, connosco e com os outros, seja presencialmente, online e em todas as dimensões temporais.\nInspirado no movimento francês “Je suis Charlie”. Começou por ser um slogan e logotipo criados pelo diretor de arte francês Joachim Roncin [fr] e adotado por apoiantes da liberdade de expressão e liberdade de imprensa após o tiroteio de 7 de janeiro de 2015, no qual doze pessoas foram mortas nos escritórios do semanário satírico francês Charlie Hebdo.\nCom a Justiça na cabeça, faça uma selfie e partilhe com quem quiser esta experiência de Justiça! Seja Justiça, sempre e em todo o lado!!`,
                takePhoto: "Clique para fotografar",
            },
        },
        graffitiPos: {
            "graffiti-1": {
                title: "Adelaide Cabete",
                imageAlt: "Graffiti Completo",
                dob: "25 de janeiro de 1867",
                dod: "14 de setembro de 1935",
                imageDesc: 'Adelaide Cabete - "Não se assustem...porque nós  caminhamos para a Justiça, para a Verdade, para a Luz, para o Direito Humano"',
                description: `Adelaide Cabete (1867–1935) foi uma das mais influentes feministas e republicanas portuguesas do início do século XX. Nascida em Elvas, de origem humilde, trabalhou desde cedo para ajudar a família, mas com o apoio do marido, Manuel Cabete, conseguiu estudar e formar-se em Medicina em 1900, tornando-se a terceira mulher médica em Portugal. A sua tese, A Proteção às Mulheres Grávidas Pobres, já revelava o seu compromisso com a justiça social e os direitos das mulheres, propondo medidas pioneiras como a licença de maternidade e o apoio estatal às mães desfavorecidas.\nA sua militância feminista foi intensa e multifacetada. Fundou e presidiu ao Conselho Nacional das Mulheres Portuguesas durante mais de duas décadas, liderando iniciativas como o Congresso Feminista e da Educação (1924), onde apresentou propostas sobre puericultura, higiene feminina e combate ao alcoolismo nas escolas. Defendia o sufrágio feminino, a educação sexual, a proteção da infância e a dignidade das mulheres em todas as esferas da vida. Foi também diretora da revista Alma Feminina, onde divulgava ideias progressistas e humanistas.\nRepublicana convicta, participou ativamente na implantação da República em 1910, tendo bordado bandeiras para serem hasteadas em Lisboa. Desiludida com o rumo político do país, especialmente com a ascensão do Estado Novo, mudou-se para Angola em 1929, onde continuou a exercer medicina e a lutar pelos direitos dos mais vulneráveis. Em 1933, tornou-se a primeira e única mulher a votar em Luanda sob a nova Constituição, num gesto simbólico de resistência e afirmação.
`,
            },
            "graffiti-2": {
                title: "Ana de Castro Osório",
                imageAlt: "Graffiti Completo",
                dob: "18 de junho de 1872",
                dod: "23 de março de 1935",
                imageDesc: 'Ana de Castro Osório  -" Ser feminista é  apenas ser justo e ser logico"',
                description: `Ana de Castro Osório (1872–1935) foi uma das figuras mais marcantes do feminismo e do republicanismo em Portugal. Nascida em Mangualde, cresceu num ambiente familiar culto e progressista, o que lhe permitiu desenvolver desde cedo uma consciência crítica e uma paixão pela escrita. Tornou-se pioneira da literatura infantil portuguesa, criando a coleção Para as Crianças e dedicando-se à alfabetização como instrumento de emancipação. Acreditava que a educação era a chave para transformar a sociedade e libertar as mulheres da subordinação legal e social que enfrentavam no início do século XX.\nA sua militância feminista ganhou força com a publicação, em 1905, do manifesto Às Mulheres Portuguesas, considerado o primeiro manifesto feminista português. Ana fundou e liderou várias organizações, como o Grupo Português de Estudos Feministas (1907), a Liga Republicana das Mulheres Portuguesas (1909) e a Associação de Propaganda Feminista (1912), que integrou a International Women Suffrage Alliance. Defendia o direito ao voto, à educação, ao trabalho e à independência económica das mulheres, e colaborou com Afonso Costa na elaboração da Lei do Divórcio de 1910, uma das primeiras conquistas da Primeira República no campo dos direitos civis.\nRepublicana convicta, Ana de Castro Osório acreditava que a República deveria servir as mulheres e não o contrário. Apesar de desilusões com o rumo da República, manteve-se fiel aos ideais de justiça e igualdade, dedicando-se à escrita e à ação social até ao fim da vida. A sua trajetória é um exemplo de coragem e visão, tendo deixado um legado duradouro na luta pelos direitos das mulheres e pela construção de uma sociedade mais justa.
`,
            }
        },
        gremioLitFaces: [
            { 
                img: "/images/256px-AlexandreHerculano.png",
                name: "Alexandre Herculano (1810 - 1877)",
                description: "História da Origem e Estabelecimento da Inquisição em Portugal - Tomo I\n\nAnalisa o surgimento da Inquisição na Europa e em Portugal, a situação dos judeus, e as suas relações com o poder político nos séculos XV e XVI."
            },
            {
                img: "/images/256px-Almeida_Garrett_por_Guglielmi.jpg",
                name: "Almeida Garrett (1799 - 1854)",
                description: "Portugal Na Balança da Europa\n\nNesta obra, Garrett analisa a crise política portuguesa, inserindo-a no contexto europeu e apelando à moderação das fações  políticas durante a contrarrevolução miguelista."
            },
            { img:
                "/images/Urbano_Tavares_Rodrigues.jpg",
                name: 'Urbano Tavares Rodrigues (1923 - 2013)',
                description: "Os Insubmissos\n\nUm livro que nos obriga a questionar a sociedade, em nome de uma justiça existencial."
            },
            {
                img: '/images/jose-saramago.jpg',
                name: 'José Saramago (1922 - 2010)',
                description: "Ensaio sobre a Lucidez\n\nJosé Saramago constrói uma poderosa alegoria sobre o embate entre o poder instituído e a vontade coletiva, denunciando a fragilidade da justiça quando os interesses públicos são ignorados."
            },
            {
                img: '/images/Francisco_Teixeira_de_Queirós_(Ilustração_Portugueza).png',
                name: 'Francisco Teixeira de Queiroz (1849 - 1919)',
                description: "Comédia Burguesa\n\nEste conjunto de romances traça um retrato multifacetado da Lisboa do século XIX, abordando tensões sociais, políticas e éticas."
            },
            {
                img: '/images/Eça_de_Queirós_c._1882.jpg',
                name: 'Eça de Queiroz (1845 - 1900)',
                description: "A Ilustre Casa de Ramires\n\nO contraste entre feitos heroicos e a mesquinhez provinciana sugere uma crítica ao comodismo político e social, onde a justiça ética se torna tema central."
            },
            {
                img: '/images/Retrato_de_Abel_Botelho_(1889)_-_António_Ramalho_Júnior_(Museu_Nacional_de_Arte_Contemporânea_-_Museu_do_Chiado).png',
                name: 'Abel Botelho (1854 - 1917)',
                description: "Amanhã\n\nAo abordar a chegada de ideias anarquistas e o sofrimento da classe trabalhadora, a obra levanta questões sobre equidade, dignidade e luta por direitos sociais."
            },
            {
                img: '/images/Carlos_Amaro_de_Miranda_e_Silva_(As_Constituintes_de_1911_e_os_seus_Deputados,_Livr._Ferreira,_1911).png',
                name: 'Carlos Amaro (1879 - 1946)',
                description: "S. João Subiu ao Trono\n\nPeça lírica, escrita para crianças, que conjuga beleza poética com valores de justiça e bondade."
            },
            {
                img: '/images/sophia.jpg',
                name: 'Sophia de Mello Breyner Andresen (1919 - 2004)',
                description: 'Mar Novo\n\n“Senhor se da tua pura justiça\nNascem os monstros que em minha roda eu vejo\nÉ porque alguém te venceu ou desviou\nEm não sei que penumbra os teus caminhos\nForam talvez os anjos revoltados.\nMuito tempo antes de eu ter vindo\nJá se tinha a tua obra dividido\nE em vão eu busco a tua face antiga\nÉs sempre um deus que nunca tem um rosto\nPor muito que eu te chame e te persiga.”'
            },
            {
                img: '/images/Teófilo_Braga_(1915)_-_Fotografia_Vasques,_Lisboa_(Museu_da_Presidência_da_República).png',
                name: 'Teófilo Braga (1843 - 1924)',
                description: "Poesia do Direito\n\nReflete sobre como arte, religião e política revelam a busca humana por justiça, beleza e verdade através da criação poética. A poesia é apresentada como força fundadora que permite traduzir o espírito em linguagem, sendo essencial nas eras de transformação e progresso social."
            }
        ],
    },
};

export default text;