import React, { Component, Fragment } from "react";
import Card from "./Card.js";
import leftArrow from '../images/left-chevron.png';
import rightArrow from '../images/right-chevron.png';
import AppData from '../AppData';


class Deck extends Component {
    constructor(props) {
        super(props);
        this.state = AppData;       
    }
    
    componentDidMount() {       

        this.numberOfCardsByIndex = this.images.children.length - 1;
        this.middleCardByIndex = Math.floor((this.numberOfCardsByIndex + 2) / 2);
        this.currentCard = this.middleCardByIndex - 1;        

        /* ********************* Responsive Code ******************** */

        // Set prefered quantity of slides per viewport (will be adjusted to maintain best result)        
        const imgQty = 2
        let imgToShow = (this.images.children.length % 2 === 0 && 
            imgQty >= this.images.children.length) ? 
            (this.images.children.length - 1) : (this.images.children.length);
        imgToShow = (imgQty > imgToShow) ? imgToShow : imgQty;   

        let imgWidthAsPercentage = 100 / imgToShow;
        imgWidthAsPercentage = window.innerWidth < 768 ? 100 : imgWidthAsPercentage;
        
        let navButtonsPlacementAsPercentage = 100 / imgToShow + 3.5;
        navButtonsPlacementAsPercentage = window.innerWidth < 768 ? 100 : navButtonsPlacementAsPercentage;

        this.newWidth = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ?
            (imgWidthAsPercentage / 100) * window.screen.width :
            (imgWidthAsPercentage / 100) * window.innerWidth;
        this.images.style.width = `${this.newWidth}px`;       
        
        this.viewPort.style.width = imgWidthAsPercentage === 100 ?
            `${this.newWidth}px` : `${this.newWidth * imgToShow}px`;     

        this.viewPort.style.height = `${this.newWidth / 1.5}px`; 
 
        // this.touchArea.style.height = this.viewPort.style.height;

        this.navButtonsContainer.style.width = `${navButtonsPlacementAsPercentage}vw`;
        this.buttonPrev.style.width = `${(this.newWidth / 2) * 0.15}px`;
        this.buttonNext.style.width = `${(this.newWidth / 2) * 0.15}px`;

        if (this.newWidth < 640) {
            this.selectionButtonsContainer.style.bottom = `${this.viewPort.getBoundingClientRect().top + 35}px`;
        } else {
            this.selectionButtonsContainer.style.bottom = `${this.viewPort.getBoundingClientRect().top + 55}px`;    
        }  

        // cloning first and last slide for smooth transition between first and last slide
        this.images.insertAdjacentHTML("afterbegin", this.images.children[this.numberOfCardsByIndex].outerHTML);        
        this.images.insertAdjacentHTML("beforeend", this.images.children[1].outerHTML);   

        for(let i = 0; i < this.images.children.length - 2; i++) {
            this.selectionButtonsContainer.children[i].transitionDuration = "0.0s";    
            this.selectionButtonsContainer.children[i].style.width = `${this.newWidth * 0.03}px`; 
            this.selectionButtonsContainer.children[i].style.height = `${this.newWidth * 0.007}px`;
        }
                
        this.orderCards();    
      
        this.rightBoundary = parseFloat(this.images.children[this.numberOfCardsByIndex + 2].style.left) + this.newWidth;
        this.leftBoundary = parseFloat(this.images.children[0].style.left) - this.newWidth;

        this.lastPositions = [];

        window.addEventListener("resize", () => {
            
            imgWidthAsPercentage = 100 / imgToShow;
            imgWidthAsPercentage = window.innerWidth < 768 ? 100 : imgWidthAsPercentage;
            navButtonsPlacementAsPercentage = 100 / imgToShow + 3;
            navButtonsPlacementAsPercentage = window.innerWidth < 768 ? 100 : navButtonsPlacementAsPercentage;

            this.newWidth = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ?
                (imgWidthAsPercentage / 100) * window.screen.width :
                (imgWidthAsPercentage / 100) * window.innerWidth; 
                   
            this.images.style.width = `${this.newWidth}px`; 

            this.viewPort.style.width = imgWidthAsPercentage === 100 ?
                `${this.newWidth}px` : `${this.newWidth * imgToShow}px`; 

            this.viewPort.style.height = `${this.newWidth / 1.5}px`;   
            // this.touchArea.style.height = this.viewPort.style.height;
            
            this.navButtonsContainer.style.width = `${navButtonsPlacementAsPercentage}vw`;
            this.buttonPrev.style.width = `${(this.newWidth / 2) * 0.15}px`;
            this.buttonNext.style.width = `${(this.newWidth / 2) * 0.15}px`;

            if (this.newWidth < 640) {
                this.selectionButtonsContainer.style.bottom = `${this.viewPort.getBoundingClientRect().top + 35}px`;
            } else {
                this.selectionButtonsContainer.style.bottom = `${this.viewPort.getBoundingClientRect().top + 55}px`;    
            }  

            for(let i = 0; i < this.images.children.length - 2; i++) {
                this.selectionButtonsContainer.children[i].transitionDuration = "0.0s";  
                this.selectionButtonsContainer.children[i].style.width = `${this.newWidth * 0.03}px`; 
                this.selectionButtonsContainer.children[i].style.height = `${this.newWidth * 0.007}px`;
            }
            
            this.orderCards();
            
            this.rightBoundary = parseFloat(this.images.children[this.numberOfCardsByIndex + 2].style.left) + this.newWidth;
            this.leftBoundary = parseFloat(this.images.children[0].style.left) - this.newWidth;

            for (let i = 0; i < this.images.children.length; i++) {
                this.lastPositions[i] = parseFloat(this.images.children[i].style.left);            
            }
        });
        
        /* ********** Hide mouse cursor above viewport when not moving ************* */

        let justHidden = false;
        let j;
        
        let hide = () => {           
            this.viewPort.style.cursor = "none";
            // console.log('hide');
            justHidden = true;
            setTimeout(() => {
                justHidden = false;
            }, 500);
        }

        this.viewPort.addEventListener("mousemove", e => {
            if (!justHidden) {
                justHidden = false;
                // console.log('move');
                clearTimeout(j);
                this.viewPort.style.cursor = "default";
                j = setTimeout(hide, 1000);
            }
        })        

        /* ****************************************************************** */
        

        /* ******************* Keyboard arrows keys navigation ************** */

        document.addEventListener( "keydown", function( event ) {
            
            if (this.scrollInProgress) return; 
            this.scrollInProgress = true;
            
            if( event.code == "ArrowLeft" ) {   
                document.getElementsByClassName("navButton")[0].click();       
            }
            if( event.code == "ArrowRight" ) {
                document.getElementsByClassName("navButton")[1].click(); 
            }

            setTimeout(() => {
                this.scrollInProgress = false;                
            }, 500);
            
        }, true);

        /* ********************************************************** */

        /* ******** Pause slider when browser tab is switched to another ********* */

        // Set the name of the hidden property and the change event for visibility
        var hidden, visibilityChange;
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }
        
        // If the page is hidden, pause the slider;
        // if the page is shown, play the slider.
        var handleVisibilityChange = () => {
            if (document[hidden]) {                
                this.stopAutoplay();                    
            } else {
                this.startAutoplay();
            }
        }

        // Warn if the browser doesn't support addEventListener or the Page Visibility API
        if (typeof document.addEventListener === "undefined" || hidden === undefined) {
            console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
        } else {
            // Handle page visibility change
            document.addEventListener(visibilityChange, handleVisibilityChange, false);        
        }

        /* ********************************************************** */

        this.updateSelection();
        

        /* ***************************** Touch navigation ******************* */

        this.startTouchPostition = 0.0;
        this.updatedPosition = 0.0;
        this.speedModifier = 0.8;       
                
        this.swapDist = 0;

        for (let i = 0; i < this.images.children.length; i++) {
            this.lastPositions.push(parseFloat(this.images.children[i].style.left));            
        }

        this.touchArea.addEventListener("touchstart", this.handleTouchStart, {
            passive: false,
        });
        
        this.touchArea.addEventListener("touchmove", this.handleTouchMove, {
        passive: false,
        });
        this.touchArea.addEventListener("touchend", this.handleTouchEnd, {
        passive: false,
        });

        /* ****************************************************************** */

        /* ********************* Button Navigation ****************** */

        this.scrollInProgress = false;      
        
        /* ********************************************************** */        

        /* ********************* Autoplay Code ********************** */

        this.autoplayTimeoutId = null;
        this.autoplayIntervalId = null;
        
        /* ********************************************************** */

        /* ********************* Init Code ************************** */

        this.selectionButtonsContainer.children[0].click();

        /* ********************************************************** */
        
        /* ***************************** Snap Back Logic ******************* */

        this.snapInProgress = false;
        this.distanceToScroll = 0.0;
        this.seed = 0.0;
        this.snapSpeedModifier = 0.05;

      /* ****************************************************************** */

    }
    
    updateSelection = () => {
        for (let i = 0; i < this.images.children.length - 2; i++) {
            if (i === this.currentCard) {
                this.selectionButtonsContainer.children[i].style.backgroundColor = "red";
                this.selectionButtonsContainer.children[i].style.opacity = 1;
            } else {
                this.selectionButtonsContainer.children[i].style.backgroundColor = "white";
                this.selectionButtonsContainer.children[i].style.opacity = null;
            }            
        }        
    }

    orderCards = () => {
        //const cardWidth = parseFloat(getComputedStyle(this.images.children[0]).width);
        let counterForRight = 1;
        let counterForLeft = this.middleCardByIndex;   

        for (let i = 0; i < this.images.children.length; i++) {
            this.images.children[i].style.transitionDuration = "0.0s";
            if (i < this.middleCardByIndex) {
                this.images.children[i].style.left = `${-1 * ((counterForLeft * this.newWidth) - (this.newWidth / 2))}px`;
                counterForLeft--;
            } else if (i > this.middleCardByIndex) {
                this.images.children[i].style.left = `${(counterForRight * this.newWidth) + (this.newWidth / 2)}px`;
                counterForRight++;
            } else {
                this.images.children[i].style.left = `${this.newWidth / 2}px`;
            }
        }
    }

    handleBoundaries = () => {
         
        if (this.lastPositions[0] <= this.leftBoundary) {
            const endOfDeck = this.lastPositions[this.numberOfCardsByIndex + 2] + this.newWidth;              
        
            this.images.removeChild(this.images.children[0]);
            this.lastPositions[0] = endOfDeck;        
            this.images.insertAdjacentHTML("beforeend", this.images.children[1].outerHTML);            
            this.images.children[this.numberOfCardsByIndex + 2].style.left = `${endOfDeck}px`;        
            this.lastPositions.splice(this.numberOfCardsByIndex + 2, 0, this.lastPositions.shift());        
        }
        if (this.lastPositions[this.numberOfCardsByIndex + 2] >= this.rightBoundary) {
            const beginningOfDeck = this.lastPositions[0] - this.newWidth;         
       
            this.images.removeChild(this.images.children[this.numberOfCardsByIndex + 2]);
            this.lastPositions[this.numberOfCardsByIndex + 2] = beginningOfDeck;            
            this.images.insertAdjacentHTML("afterbegin", this.images.children[this.numberOfCardsByIndex].outerHTML);
            this.images.children[0].style.left = `${beginningOfDeck}px`;        
            this.lastPositions.splice(0, 0, this.lastPositions.pop());        
        }
    }

    /* ***************************** Snap Back Logic ******************* */

    snapBack = () => {
        this.snapInProgress = true;
        let swapRem = this.swapDist % this.newWidth;

        /* set snapBack sensivity. 2 will cause snapBack if swipe is less then half of the slide. */
        let snapSens = 4;
        let snapForward = (this.newWidth / snapSens - Math.abs(swapRem)) < 0;
        this.distanceToScroll = (!snapForward) ?
            -1.0 * swapRem : (this.newWidth - Math.abs(swapRem)) * (swapRem > 0 ? 1.0: -1.0);
        
        if (this.distanceToScroll < 0 && snapForward) {
            this.currentCard = (this.currentCard === this.numberOfCardsByIndex) ? 0 : ++this.currentCard; 
        } 
        if (this.distanceToScroll > 0 && snapForward) {
            this.currentCard = (this.currentCard === 0) ? this.numberOfCardsByIndex : --this.currentCard;  
        } 

        this.animateSnap();
    };

    animateSnap = () => {
        this.seed = parseFloat(this.seed.toFixed(2));

        let percentageToMove = Math.pow(this.seed, 2.0);
        percentageToMove = parseFloat(percentageToMove.toFixed(2));

        if (this.seed > 1) {
        
            for (let i = 0; i < this.images.children.length; i++) {
                this.updatedPosition = parseFloat((this.lastPositions[i] + this.distanceToScroll).toFixed(2));
                this.images.children[i].style.left = `${this.updatedPosition}px`; 
                this.lastPositions[i] = this.updatedPosition;   
            }

            this.handleBoundaries();
            this.updateSelection();            

            this.snapInProgress = false;
            this.seed = 0.0;

            return;
        }

        for (let i = 0; i < this.images.children.length; i++) {
        this.updatedPosition = this.lastPositions[i] + (percentageToMove * this.distanceToScroll);
        this.images.children[i].style.left = `${this.updatedPosition}px`;            
        }
        
        this.seed += 1 * this.snapSpeedModifier;
        requestAnimationFrame(this.animateSnap);
    }

  /* ****************************************************************** */

  /* ***************************** Touch navigation ******************* */

    handleTouchStart = (event) => {
        if (this.snapInProgress) return;
        this.stopAutoplay();

        this.swapDist = 0;
        this.frameCounter = 0;
        this.startTouchPostition = event.changedTouches[0].screenX;

        for (let i = 0; i < this.images.children.length; i++) {
        this.images.children[i].style.transitionDuration = "0.0s";
        }
    };
  
    handleTouchMove = (event) => {
        event.preventDefault();
        if (this.snapInProgress) return;

        const currentTouchPosition = event.changedTouches[0].screenX;
        let difference = currentTouchPosition - this.startTouchPostition;
        difference *= this.speedModifier;
        this.swapDist += difference;
        this.frameCounter += difference;

        this.startTouchPostition = currentTouchPosition;

        for (let i = 0; i < this.images.children.length; i++) {
            this.updatedPosition = this.lastPositions[i] + difference;
            this.images.children[i].style.left = `${this.updatedPosition}px`;
            this.lastPositions[i] = this.updatedPosition;            
        }

        if (this.frameCounter < (this.newWidth * -1.0)) {
            this.currentCard = (this.currentCard === this.numberOfCardsByIndex) ? 0 : ++this.currentCard;         
            this.updateSelection();    
            this.frameCounter = 0;  
        }

        if (this.frameCounter > this.newWidth) {
            this.currentCard = (this.currentCard === 0) ? this.numberOfCardsByIndex : --this.currentCard; 
            this.updateSelection();          
            this.frameCounter = 0;             
        }
         
        this.handleBoundaries();
    };

    handleTouchEnd = () => {
        if (this.snapInProgress) return;     
        this.snapBack();
        this.startAutoplay();
    };

    /* ****************************************************************** */
    
    
    /* ********************* Button Navigation ****************** */   

    handleNext = () => {
        if (this.scrollInProgress) return;
        this.stopAutoplay();   
        
        this.scrollInProgress = true;
        
        for (let i = 0; i < this.images.children.length; i++) {
            this.images.children[i].style.transitionDuration = "0.5s";

            const updatedPosition = this.lastPositions[i] - this.newWidth;
            
            this.images.children[i].style.left = `${updatedPosition}px`;            
            this.lastPositions[i] = updatedPosition;                     
        }
        
        this.currentCard = (this.currentCard === this.numberOfCardsByIndex) ? 0 : ++this.currentCard;

        this.handleBoundaries();
        this.updateSelection();
                
        setTimeout(() => {
            this.scrollInProgress = false;
            this.startAutoplay();            
        }, 500);
    }

    handlePrev = () => {
        if (this.scrollInProgress) return;   
        this.stopAutoplay();

        this.scrollInProgress = true;
       
        for (let i = 0; i < this.images.children.length; i++) {
            this.images.children[i].style.transitionDuration = "0.5s";

            const updatedPosition = this.lastPositions[i] + this.newWidth;
            
            this.images.children[i].style.left = `${updatedPosition}px`;            
            this.lastPositions[i] = updatedPosition;           
        }
       
        this.currentCard = (this.currentCard === 0) ? this.numberOfCardsByIndex : --this.currentCard;

        this.handleBoundaries();
        this.updateSelection();
        
        setTimeout(() => {
            this.scrollInProgress = false;
            this.startAutoplay();
        }, 500);
    }
    
    /* ********************************************************** */
    
    /* ********************* Selection Navigation *************** */

    handleSelection = event => {
        if (event.target === this.selectionButtonsContainer) return;
        this.stopAutoplay();
        
        let newCard = null;

        for (let i = 0; i < this.images.children.length - 2; i++) {
            if (event.target === this.selectionButtonsContainer.children[i]) {
                newCard = i; 
            }         
        }

        for (let i = 0; i < this.images.children.length; i++) {
           const updatedPosition = this.lastPositions[i] + ((this.currentCard - newCard) * this.newWidth);

           this.images.children[i].style.transitionDuration = "0.0s";          
           this.images.children[i].style.left = `${updatedPosition}px`;
           this.lastPositions[i] = updatedPosition;           
        }
        
        for (let i = 0; i < Math.abs(this.currentCard - newCard); i++) {   
            this.handleBoundaries();  
        }

        this.currentCard = newCard;
        this.updateSelection();
        this.startAutoplay();
    }
        
    /* ********************************************************** */
    
    
    
    /* ********************* Autoplay Code ********************** */

    startAutoplay = () => {
        clearTimeout(this.autoplayTimeoutId);
        clearInterval(this.autoplayIntervalId);

        this.autoplayTimeoutId = setTimeout(() => {
            this.autoplayIntervalId = setInterval(() => {
                for (let i = 0; i < this.images.children.length; i++) {
                    this.images.children[i].style.transitionDuration = "0.9s";
        
                    const updatedPosition = this.lastPositions[i] - this.newWidth;
                    
                    this.images.children[i].style.left = `${updatedPosition}px`;            
                    this.lastPositions[i] = updatedPosition;           
                }
        
                this.currentCard = (this.currentCard === this.numberOfCardsByIndex) ? 0 : ++this.currentCard;
        
                this.handleBoundaries();
                this.updateSelection();
            }, 5100)
        }, 3500);
    }
        
    /* ********************* Stop autoplay ********************** */

    stopAutoplay = () => {
        clearTimeout(this.autoplayTimeoutId);
        clearInterval(this.autoplayIntervalId);
    }

    /* ********************************************************** */

    render() {
        return (
            <Fragment>
                <div ref={refId => this.navButtonsContainer = refId} className="navButtonsContainer">
                    <img onClick={this.handlePrev} ref={refId => this.buttonPrev = refId} className="navButton" src={leftArrow} alt="prev" id="prev" />
                    <img onClick={this.handleNext} ref={refId => this.buttonNext = refId} className="navButton" src={rightArrow} alt="next" id="next" />
                </div>
                <div ref={refId => this.viewPort = refId} className="viewPort">
                    <div ref={refId => this.images = refId} className="imagesContainer"> 
                        {this.state.cards.map((item, index) => {
                                return (
                                    <Card source={`${item.src}`} id={index} key={index} />                                    
                                )
                            }, this)
                        } 

                    </div>
                    <div ref={(refId) => (this.touchArea = refId)} className="touchArea"></div>
                </div>
               
                <div onClick={this.handleSelection} ref={refId => this.selectionButtonsContainer = refId} className="selectionButtonsContainer">
                    {
                        this.state.cards.map((_, i) => {
                            return (<div className="selectionButton" key={i}></div>)
                        })
                    }                   
                </div>
            </Fragment>
        )
    }
}


export default Deck;