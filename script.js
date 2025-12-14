// --- GLOBAL VARIABLE DEFINITIONS ---
const slider = document.querySelector(".slider");
const slideTitle = document.querySelector(".slide-title");
const thumbnailWheel = document.querySelector(".thumbnail-wheel");

// INTRO ELEMENTS
const introScreen = document.querySelector(".intro-screen");
const introMessage = document.querySelector(".intro-message");

// --- CONTENT DEFINITION ---
const totalSlides = 20; 
const endScale = 5;
let slideWidth = window.innerWidth * 0.45;
let viewportCenter = window.innerWidth / 2;

const slideTitles = [
    "Zhuldyz, My love the time we spent together has been the best times i've had in a long time and I am beyond grateful to have met a beautiful soul like you. I wish your 20's to be some of the best years of your life, I hope others will bring light to your world like how you bring to mine, keep showing the world how much of a fabulous woman you are, With much love \n SUZE <3", 
    'Удачи в жизни, чтоб солнце всегда освещало путь в светлое будущее.\n~Ismail', 
    "Жұлдыз, поздравляю тебя с днем рождения ! Хочу чтоб в этом году тебя везде сопровождала удача и успех во всех начинаниях,ну и конечно чтоб Суза не обижала ;) ! Оставайся такой же яркой!\n ~Alim", 
    "Жузя! С новым для тебя годом — пусть твой дневник наполняется радостью, инста эстетикой, а карта огромным количеством зелени \n~Polina", "Жузя,  С Днём Рождения Пусть у тебя все получается, ведь нет ничего невозможного \n ~Elina", "Желаю, чтобы жизнь щедро дарила тебе поводы для улыбки и людей, ради которых хочется свернуть горы. Пусть каждый поворот в твоём пути ведёт к чему-то поистине прекрасному \n ~Layla", "С днём рождения Я бы хотела тебе пожелать, чтобы, оглядываясь на свою студенческую жизнь через 10 или 20 лет после выпуска, на твоем лице появлялась ностальгическая улыбка, и у тебя были самые тёплые воспоминания об этом времени! Чтобы ты помнила не только зачёты и дедлайны, но и ночные разговоры в общежитии и посиделки в юаньзоне. Будь счастлива Обнимаю. \n ~ Diana", "Zhuldyz, happy birthday! Wishing you endless happiness, bright days, loyal friends, and great achievements. May your life be full of joy, love, and opportunities. Stay as shining and wonderful as you are! \n ~ Bota", "С днём рождения, Жулдыз! Пусть каждый день приносит тебе повод улыбнуться, а жизнь удивляет только приятными сюрпризами. Желаю тебе смеха до слёз, любви до мурашек и счастья до потолка! Тұған күнің құтты болсын! \n ~ Ablay", "Zhuldyz Wish you More money and happiness girl 来财! \n ~MAX", "Hey Zhuldyz, Happy 20th Birthday, May your 20's be filled with laughter,fun and success \n ~SHANDY", "Zhuzikk, you radiate such wonderful energy and have a very unique vibe. The more I get to know you, the more I feel you have depth. I feel so lucky to have met you. \n ~EMMA", "⭐️", "⭐️", "⭐️", "⭐️", "⭐️", "⭐️", "⭐️", "⭐️",
];

// Animation/Loop Variables
let currentX = 0;
let targetX = 0; 
let isScrolling = false;
let scrollTimeout;

// Title/Synchronization Variables
let activeSlideIndex = 0;
let closestDistance = Infinity; 
let newActiveSlideIndex = 0;   

// --- INTRO SPECIFIC VARIABLE (Drives wheel movement during intro) ---
let introRotationX = null; 

// --- SLEEP MODE VARIABLES ---
const INACTIVITY_TIMEOUT_MS = 3000; // 15 seconds of inactivity triggers sleep mode
let sleepTimer;
let isSleeping = false;


// --- SLIDE CREATION AND INITIALIZATION ---
function createSlides() {
    // Initialize the final slide title content before the intro starts
    slideTitle.textContent = slideTitles[activeSlideIndex];
    
    for (let i = 0; i < totalSlides * 3; i++) {
        const slide = document.createElement("div");
        slide.className = "slide";

        // NOTE: This version uses images only, matching your latest code block.
        const img = document.createElement("img");
        const imageNumber = (i % totalSlides) + 1;
        img.src = `images/slide-${imageNumber}.jpg`;

        slide.appendChild(img);
        slider.appendChild(slide);
    }
}

function initializeSlider() {
    const slides = document.querySelectorAll(".slide");

    slides.forEach((slide, index) => {
        const x = index * slideWidth - slideWidth; 
        gsap.set(slide, {x: x});
    });

    const centerOffset = window.innerWidth / 2 - slideWidth / 2;
    currentX = centerOffset;
    targetX = centerOffset;
}


// --- SCROLL HANDLER ---
function handleScroll(e) {
    const scrollIntensity = e.deltaY || e.detail || e.wheelDelta * -1;
    targetX -= scrollIntensity * 1;

    isScrolling = true;
    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
        isScrolling = false;
    }, 150);
}


// --- THUMBNAIL POSITIONING FUNCTIONS ---
function positionThumbnailItems() {
    const itemWidth = 35; 
    const itemHeight = 50;
    const radius = 250; 
    const centerX = thumbnailWheel.offsetWidth / 2; 
    const centerY = thumbnailWheel.offsetHeight / 2; 

    gsap.set(thumbnailWheel, { 
        transformOrigin: "center center" 
    });

    const thumbnails = document.querySelectorAll(".thumbnail-item");
    if (thumbnails.length === 0) return;

    thumbnails.forEach((thumbnail) => {
        const angle = parseFloat(thumbnail.dataset.angle);

        let x = radius * Math.cos(angle) + centerX; 
        let y = radius * Math.sin(angle) + centerY; 
        
        x -= itemWidth / 2;
        y -= itemHeight / 2; 

        gsap.set(thumbnail, {
            x: x,
            y: y,
            transformOrigin: "center center",
        });
    });
}

function createThumbnailItems() {
    for (let i = 0; i < totalSlides; i++) {
        const thumbnail = document.createElement("div");
        thumbnail.className = "thumbnail-item";
        
        const angle = (i / totalSlides) * Math.PI * 2;
        thumbnail.dataset.angle = angle;
        
        const img = document.createElement("img");
        const imageNumber = i + 1;
        img.src = `images/slide-${imageNumber}.jpg`; 
        thumbnail.appendChild(img);
        
        thumbnailWheel.appendChild(thumbnail);
    }
    
    positionThumbnailItems();
}


// --- UPDATE THUMBNAIL ITEMS (USES INTRO VARIABLE OR CURRENTX) ---
function updateThumbnailItems() {
    // CRITICAL: Determine which X value to use for calculating rotation
    const drivingX = (introRotationX !== null) ? introRotationX : currentX;
    
    // Rotation Logic: Maps X position to a 360-degree rotation value
    const exactSlideProgress = Math.abs(drivingX / slideWidth) * (360 / totalSlides) + 90;
    const currentRotationAngle = -(exactSlideProgress);
    
    // Set the overall rotation on the WHEEL CONTAINER
    gsap.set(thumbnailWheel, { rotation: currentRotationAngle });
    
    const thumbnails = document.querySelectorAll(".thumbnail-item");
    thumbnails.forEach((thumbnail) => {
        // CRITICAL: Counter-rotate the individual items so they stay vertical
        gsap.set(thumbnail, {
            rotation: -currentRotationAngle, 
        });
    });
}


// --- SLEEP MODE FUNCTIONS ---
function sleep() {
    if (introRotationX !== null || isSleeping) return; 
    isSleeping = true;
    
    // Animate the main slides out
    gsap.to(document.querySelectorAll(".slide"), {
        autoAlpha: 0, 
        duration: 0.8,
        ease: "power2.inOut",
        stagger: 0.02
    });
    
    // UPDATED: Make the thumbnail wheel LARGER (e.g., scale 1.5)
    gsap.to(thumbnailWheel, {
        scale: 1.5, // ZOOMS IN
        duration: 1.0,
        ease: "power2.inOut"
    });

    // Make the title slightly larger
    gsap.to(slideTitle, {
        scale: 1.2, 
        duration: 1.0,
        ease: "power2.inOut"
    });
}

function wake() {
    if (!isSleeping) return;
    isSleeping = false;
    
    // Animate the main slides back in
    gsap.to(document.querySelectorAll(".slide"), {
        autoAlpha: 1, 
        duration: 0.5,
        ease: "power2.inOut",
    });
    
    // Restore thumbnail wheel and title to default scale (1)
    gsap.to(thumbnailWheel, {
        scale: 1, 
        duration: 0.5,
        ease: "power2.inOut"
    });

    gsap.to(slideTitle, {
        scale: 1, 
        duration: 0.5,
        ease: "power2.inOut"
    });
}

function resetInactivityTimer() {
    // Only manage the timer once the intro animation is complete
    if (introRotationX !== null) return;
    
    clearTimeout(sleepTimer);
    
    if (isSleeping) {
        wake();
    }
    
    // Set a new timer to call sleep() after the timeout period
    sleepTimer = setTimeout(sleep, INACTIVITY_TIMEOUT_MS);
}


// --- FADE/SCALE TITLE ANIMATION HELPER (Robust replacement for dice roll) ---
function animateTitleChange(element, currentText, targetText) {
    if (currentText === targetText) return;
    
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut", duration: 0.25 } });

    tl
    // 1. Fade the current text out while shrinking it slightly
    .to(element, { 
        autoAlpha: 0, 
        scale: 0.9, 
        duration: 0.2 
    }, 0)

    // 2. Immediately change the text content
    .call(() => {
        element.textContent = targetText;
    })

    // 3. Fade the new text back in and return to full scale
    .to(element, { 
        autoAlpha: 1, 
        scale: 1, 
        duration: 0.3 
    }, 0.2) 

    .set(element, { scale: 1 }, 0.5); 
}

// --- TITLE UPDATE FUNCTION (called by the animation loop) ---
function updateSlideTitle(newIndex) {
    const currentTitle = slideTitle.textContent;
    const newTitle = slideTitles[newIndex];
    
    // Only animate if the intro is finished
    if (introRotationX === null) {
        animateTitleChange(slideTitle, currentTitle, newTitle);
    }
}


// --- MASTER INTRO TIMELINE ---
function masterIntroTimeline() {
    const tl = gsap.timeline({ defaults: { duration: 1, ease: "power2.out" } });
    const totalSpinDuration = 3.5; 
    
    const thumbnails = document.querySelectorAll(".thumbnail-item");
    
    // --- 0. Initial State: Hide all main elements ---
    gsap.set([slider, slideTitle, thumbnailWheel, thumbnails], { autoAlpha: 0 }); 

    // --- 1. Reveal Intro Message ---
    tl.to(introMessage, { autoAlpha: 1, duration: 1.0 }, 0.5) 
      .to(introScreen, { autoAlpha: 0, duration: 1.0 }, 3.0) // Fade the whole screen out
      .set(introScreen, { display: 'none' }, 4.0); // FIX: Remove intro screen from flow

    // --- 2. Start Main Content Reveal ---
    const mainRevealStart = 3.5; 

    // Wheel Spin animation runs from mainRevealStart to mainRevealStart + 3.5s
    tl.to({}, { 
        duration: totalSpinDuration, 
        ease: "circ.out",
        onStart: function() {
            introRotationX = 0; 
            gsap.set(thumbnailWheel, { autoAlpha: 1 });
            gsap.to({x: 0}, {
                x: -(totalSlides * slideWidth),
                duration: totalSpinDuration,
                ease: "circ.out",
                onUpdate: function() {
                    introRotationX = this.targets()[0].x;
                    updateThumbnailItems(); 
                }
            });
        }
    }, mainRevealStart); 

    // Reveal thumbnails staggered during the spin
    tl.fromTo(thumbnails, 
        { autoAlpha: 0, scale: 0.5 },
        {
            autoAlpha: 1,
            scale: 1,
            stagger: {
                each: totalSpinDuration / totalSlides, 
                from: "center", 
                start: mainRevealStart
            },
            duration: 0.2, 
            ease: "back.out(2)"
        }
    , mainRevealStart);

    // --- 3. Reveal Main Slides and Final Cleanup ---
    const finalRevealStart = mainRevealStart + totalSpinDuration; 

    tl.to(slider, { autoAlpha: 1, duration: 1.5, ease: "power1.out" }, finalRevealStart) 
      
    // --- 4. Final Cleanup & Enable Interaction ---
    tl.call(() => {
        introRotationX = null;
        // Show the slide caption (slideTitle)
        gsap.set(slideTitle, { autoAlpha: 1, scale: 1.0 }); 
        
        // Start the inactivity timer immediately after the intro finishes
        resetInactivityTimer();
    }, null, finalRevealStart + 1.5); 
}


// --- MAIN ANIMATION LOOP ---
function animate() {
    // [1] Scrolling and Looping
    if (introRotationX === null) { 
        currentX += (targetX - currentX) * 0.1;
    } 

    const totalWidth = totalSlides * slideWidth;
    if (currentX > 0) {
        currentX -= totalWidth;
        targetX -= totalWidth;
    } else if (currentX < -totalWidth) {
        currentX += totalWidth;
        targetX += totalWidth;
    }

    const slides = document.querySelectorAll(".slide");

    // Reset tracking variables for the new frame
    closestDistance = Infinity; 
    newActiveSlideIndex = 0; 

    // [2] Slide Positioning and Scaling
    slides.forEach((slide, index) => {
        const x = index * slideWidth + currentX;
        gsap.set(slide, { x: x }); 

        const slideCenterX = x + slideWidth / 2;
        const distancefromCenter = Math.abs(slideCenterX - viewportCenter);
        
        // --- LOGIC: DETERMINE ACTIVE SLIDE ---
        if (distancefromCenter < closestDistance) {
            closestDistance = distancefromCenter;
            newActiveSlideIndex = index % totalSlides; 
        }

        // Scaling logic based on distance from center
        const outerDistance = slideWidth * 3;
        const progress = Math.min(distancefromCenter / outerDistance, 1);
        const easedProgress = 
            progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const scale = 1 + easedProgress * (endScale - 1);
        
        // Target the image element
        const mediaElement = slide.querySelector("img");
        gsap.set(mediaElement, { scale: scale });
    });

    // [3] Thumbnail and Title Updates
    if (newActiveSlideIndex !== activeSlideIndex) {
        activeSlideIndex = newActiveSlideIndex;
        // CRITICAL: Only update the title if the intro is finished
        if (introRotationX === null) {
            updateSlideTitle(activeSlideIndex); 
        }
    }
    
    updateThumbnailItems(); 

    requestAnimationFrame(animate);
}


// --- EVENT HANDLERS AND EXECUTION WRAPPED IN DOM CONTENT LOADED ---
function handleResize() {
    slideWidth = window.innerWidth * 0.45;
    viewportCenter = window.innerWidth / 2;
    
    resetInactivityTimer(); // Reset timer on resize interaction
    positionThumbnailItems();
    initializeSlider();
}

// Global mouse/touch/key events to detect any interaction
window.addEventListener('mousemove', resetInactivityTimer);
window.addEventListener('touchstart', resetInactivityTimer);
window.addEventListener('keydown', resetInactivityTimer);

window.addEventListener('resize', handleResize);

// Modify scroll handler to also reset the timer
function handleScrollAndReset(e) {
    handleScroll(e); // Calls your existing scroll logic
    resetInactivityTimer();
}

window.addEventListener("wheel", handleScrollAndReset, { passive: false });
window.addEventListener("DOMMouseScroll", handleScrollAndReset, { passive: false });


window.addEventListener(
    "scroll",
    function (e) {
        if (e.target === document || e.target === document.body) {
            this.window.scrollTo(0, 0);
        }
    },
    { passive: false }
);


// --- INITIAL CALLS (Runs once the HTML is fully loaded) ---
document.addEventListener('DOMContentLoaded', (event) => {
    // 1. Setup all elements and initial positions
    createSlides();
    initializeSlider();
    createThumbnailItems(); 

    // 2. Start the continuous animation loop
    animate();

    // 3. Immediately trigger the master intro timeline
    masterIntroTimeline();
    
    // NOTE: Initial timer starts at the end of the masterIntroTimeline call.
});