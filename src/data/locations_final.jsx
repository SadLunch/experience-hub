import GiantJustice from "../experiments/GiantJusticeExperiment";
import Graffiti_1FM_Image1 from "../experiments/Graffiti_1FM_Image1";
import Graffiti_1FM_Image2 from "../experiments/Graffiti_1FM_Image2";
// import Graffiti_2FM_Image1 from "../experiments/Graffiti_2FM_Image1";
// import Graffiti_2FM_Image2 from "../experiments/Graffiti_2FM_Image2";
import GremioLiterario from "../experiments/GremioLiterario";
import MindARFaceTracking from "../experiments/MindARFaceTracking";
import WhacAMoleV3New from "../experiments/Whac-A-Mole_v3New";

export const locations = [
    {
        id: 'loc1' /* Text */,
        coordinates: [38.712004360930486, -9.140893187916427] /* list of two floats Ex.: [12.345, 67.890] */,
        location: "Largo do Carmo",
        participants: 0 /* Number */,
        color: '#EE1D37' /* Color code */,
        experiment: {
            id: 'whac-a-mole' /* Text */,
            component: WhacAMoleV3New /*Placeholder*/,
            sessionOptions: {
                requiredFeatures: ['dom-overlay'] /*Placeholder*/,
                domOverlay: { root: document.body },
            },
            isWebXR: true /* true or false */,
            disabled: false /* true or false (don't know if needed) */,
            attributions: [
                '<a href="https://skfb.ly/owxOK" target="_blank" rel="nofollow">"gavel"</a> by <a href="https://sketchfab.com/ruteshsakpal" target="_blank" rel="nofollow">rutesh sakpal</a> is licensed under <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="nofollow">Creative Commons Attribution</a>.',
                '<a href="https://skfb.ly/o9HYz" target="_blank" rel="nofollow">"White Lilly - Metascan"</a> by <a href="https://sketchfab.com/moshecaine" target="_blank" rel="nofollow">Moshe Caine</a> is licensed under <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="nofollow">Creative Commons Attribution</a>.',
                '<a href="https://www.flaticon.com/free-icons/windows-media-audio" title="windows media audio icons">Windows media audio icons created by Ferdinand - Flaticon</a>',
                '<a href="https://www.flaticon.com/free-icons/mute" title="mute icons">Mute icons created by adrianadam - Flaticon</a>',
            ] /* list of text */
        }
    },
    {
        id: 'loc2' /* Text */,
        coordinates: [38.71001326249752, -9.140169870055326] /* list of two floats Ex.: [12.345, 67.890] */,
        location: "Grémio Literário",
        participants: 0 /* Number */,
        color: '#F26621' /* Color code */,
        experiment: {
            id: 'gremio-lit' /* Text */,
            component: GremioLiterario /*Placeholder*/,
            sessionOptions: {
                requiredFeatures: ['dom-overlay'] /*Placeholder*/,
                domOverlay: { root: document.body },
            },
            isWebXR: true /* true or false */,
            disabled: false /* true or false (don't know if needed) */,
            attributions: [
                '<a href="https://aminoapps.com/c/the-halloween-amino/page/blog/pacman-skull/bYn3_G5iou83d1Q1Jl103q8K2W7qlWRRNNUg" target="_blank" rel="nofollow">"Pacman Skull"</a> by <a href="https://aminoapps.com/c/the-halloween-amino/page/user/reapers-horror/kdkj_laI4fpr6Z53DpBlWMzNM70xlaVGqe" target="_blank" rel="nofollow">Reapers Horror</a>.',
                '<a href="https://giphy.com/stickers/pixel-red-heart-MnxzcptT3L0r8Wbnh2" target="_blank" rel="nofollow">"I Love You Heart Sticker"</a> by <a href="https://giphy.com/shurushok" target="_blank" rel="nofollow">shurushok</a> on <a href="https://giphy.com" target="_blank" rel="nofollow">GIPHY</a>',
                '<a href="https://skfb.ly/6WXT9" target="_blank" rel="nofollow">"Fallen Book"</a> by <a href="https://sketchfab.com/jesseroberts" target="_blank" rel="nofollow">jesseroberts</a> is licensed under <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="nofollow">Creative Commons Attribution</a>.',
            ] /* list of text */
        }
    },
    {
        id: 'loc3' /* Text */,
        coordinates: [38.70968531334263, -9.141464462160384] /* list of two floats Ex.: [12.345, 67.890] */,
        location: "Teatro Nacional de São Carlos",
        participants: 0 /* Number */,
        color: '#5690CC' /* Color code */,
        experiment: {
            id: 'graffiti-1' /* Text */,
            component: Graffiti_1FM_Image1,
            // component: {
            //     'easy': Graffiti_1FM_Image1,
            //     'hard': Graffiti_2FM_Image1
            // } /*Placeholder*/,
            sessionOptions: {
                requiredFeatures: ['dom-overlay'] /*Placeholder*/,
                domOverlay: { root: document.body },
            },
            isWebXR: true /* true or false */,
            disabled: false /* true or false (don't know if needed) */,
            attributions: [
                '<a href="https://sketchfab.com/3d-models/spray-paint-can-7223f972a1b44194abdc8f84b896086d?utm_medium=embed&utm_campaign=share-popup&utm_content=7223f972a1b44194abdc8f84b896086d" target="_blank" rel="nofollow"> Spray Paint Can </a> by <a href="https://sketchfab.com/Isuk?utm_medium=embed&utm_campaign=share-popup&utm_content=7223f972a1b44194abdc8f84b896086d" target="_blank" rel="nofollow"> Isuk </a> is licensed under <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="nofollow">Creative Commons Attribution</a>.',
                'Sound Effect by <a href="https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=87908">freesound_community</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=87908">Pixabay</a>',
                'Sound Effect by <a href="https://pixabay.com/users/floraphonic-38928062/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=185122">floraphonic</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=185122">Pixabay</a>',
                '<a href="https://www.vecteezy.com/free-vector/graffiti-background">Graffiti Background Vectors by Vecteezy</a>'
            ] /* list of text */
        }
    },
    {
        id: 'loc4' /* Text */,
        coordinates: [38.70872353140405, -9.141419528428177] /* list of two floats Ex.: [12.345, 67.890] */,
        location: "Rua Serpa Pinto",
        participants: 0 /* Number */,
        color: '#B0D351' /* Color code */,
        experiment: {
            id: 'graffiti-2' /* Text */,
            component: Graffiti_1FM_Image2,
            // component: {
            //     'easy': Graffiti_1FM_Image2,
            //     'hard': Graffiti_2FM_Image2
            // }/*Placeholder*/,
            sessionOptions: {
                requiredFeatures: ['dom-overlay'] /*Placeholder*/,
                domOverlay: { root: document.body },
            },
            isWebXR: true /* true or false */,
            disabled: false /* true or false (don't know if needed) */,
            attributions: [
                '<a href="https://sketchfab.com/3d-models/spray-paint-can-7223f972a1b44194abdc8f84b896086d?utm_medium=embed&utm_campaign=share-popup&utm_content=7223f972a1b44194abdc8f84b896086d" target="_blank" rel="nofollow"> Spray Paint Can </a> by <a href="https://sketchfab.com/Isuk?utm_medium=embed&utm_campaign=share-popup&utm_content=7223f972a1b44194abdc8f84b896086d" target="_blank" rel="nofollow"> Isuk </a> is licensed under <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="nofollow">Creative Commons Attribution</a>.',
                'Sound Effect by <a href="https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=87908">freesound_community</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=87908">Pixabay</a>',
                'Sound Effect by <a href="https://pixabay.com/users/floraphonic-38928062/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=185122">floraphonic</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=185122">Pixabay</a>',
                '<a href="https://www.vecteezy.com/free-vector/graffiti-background">Graffiti Background Vectors by Vecteezy</a>'
            ] /* list of text */
        }
    },
    {
        id: 'loc5' /* Text */,
        coordinates: [38.710880666013445, -9.139602147975914] /* list of two floats Ex.: [12.345, 67.890] */,
        location: "Rua Nova do Almada",
        participants: 0 /* Number */,
        color: '#7161AB' /* Color code */,
        experiment: {
            id: 'justica-monstro' /* Text */,
            component: GiantJustice /*Placeholder*/,
            isWebXR: false /* true or false */,
            disabled: false /* true or false (don't know if needed) */,
            attributions: [] /* list of text */
        }
    },
    {
        id: 'loc6' /* Text */,
        coordinates: [38.709802105698756, -9.139374915593871] /* list of two floats Ex.: [12.345, 67.890] */,
        location: "Antigo Tribunal da Boa Hora",
        participants: 0 /* Number */,
        color: '#ED3A95' /* Color code */,
        experiment: {
            id: 'selfie' /* Text */,
            component: MindARFaceTracking /*Placeholder*/,
            isWebXR: false /* true or false */,
            disabled: false /* true or false (don't know if needed) */,
            attributions: [
                '<a href="https://www.flaticon.com/free-icons/pixel" title="pixel icons">Pixel icons created by Taufik Ramadhan - Flaticon</a>'
            ] /* list of text */
        }
    },
    // {
    //     id: 'loc7' /* Text */,
    //     coordinates: [] /* list of two floats Ex.: [12.345, 67.890] */,
    //     participants: 0 /* Number */,
    //     color: '#2A2E7F' /* Color code */,
    //     experiment: {
    //         id: '' /* Text */,
    //         component: ''/*Placeholder*/,
    //         sessionOptions: {
    //             requiredFeatures: '' /*Placeholder*/,
    //             optionalFeatures: '' /*Placeholder*/,
    //         },
    //         isWebXR: true /* true or false */,
    //         disabled: false /* true or false (don't know if needed) */,
    //         attributions: [] /* list of text */
    //     }
    // },
    // {
    //     id: 'loc8' /* Text */,
    //     coordinates: [] /* list of two floats Ex.: [12.345, 67.890] */,
    //     participants: 0 /* Number */,
    //     color: '#5690CC' /* Color code */,
    //     experiment: {
    //         id: '' /* Text */,
    //         component: ''/*Placeholder*/,
    //         sessionOptions: {
    //             requiredFeatures: '' /*Placeholder*/,
    //             optionalFeatures: '' /*Placeholder*/,
    //         },
    //         isWebXR: true /* true or false */,
    //         disabled: false /* true or false (don't know if needed) */,
    //         attributions: [] /* list of text */
    //     }
    // },
]