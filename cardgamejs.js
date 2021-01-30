/*ensures everything happens AFTER page load*/
//really have a strange suspicion that doing all of my JS inside this will cause some kind of issue but I don't know what 
//that issue might be, only that async functions are valuable for JS soooo 
        window.onload = function() {
            console.log('page loaded');

            /*first time page load message*/
            if (!('hasCodeRunBefore' in localStorage)) {
                alert('Welcome to Blackout! Please drink responsibly.');
                localStorage.setItem('hasCodeRunBefore', true);
                console.log('first time user welcomed')
            }
            else {
                //alert('Back so soon? Please drink responsibly.');
                console.log('repeat user');
            }
            
            var NCB = document.getElementById('newCardButton');
            var RDB = document.getElementById('rollDiceButton');
            
            
            /*button click for new card*/
            NCB.addEventListener('click', cardFunction);
            /*new card draw function*/
            function cardFunction() { //should probably take inputs
                //alert('NEW CARD');
                console.log('card function triggered');
                //console.log(deck);
                //local variable for randomly drawn card 
                let randomlydrawncard = deck[Math.floor(Math.random() * deck.length)];
                //log the card
                console.log(randomlydrawncard);
                document.getElementById("card_display").textContent = randomlydrawncard[0];
            }
            //card object would be nice, to populate more easily but for right now I think I will just use three separate arrays
            let card1 = ['Do a silly dance','G','Original','Dare',true];
            let card2 = ['Pick up your phone','PG-13','Expansion 1','Group', false];
            let card3 = ['Move your piece two spaces','R','Expansion 2','Movement', false];
            let card4 = ['card 4'];
            let card5 = ['card 5'];
            let card6 = ['card 6'];
            let card7 = ['card 7'];
            let card8 = ['card 8'];
            let card9 = ['card 9'];
            let card10 = ['card 10'];

            //pretend deck array, solves a little more of my problem so I could just populate a card from this array. 
            let deck = [card1,card2,card3,card4,card5,card6,card7,card8,card9,card10];

            //variable to display the number of cards drawn
            var cardsdrawn = 0;

            NCB.addEventListener('click', drawCard);
            //increases the number of cards drawn by one per each card drawn.
            function drawCard() {
                cardsdrawn = cardsdrawn + 1
                //document.getElementById("card_display").textContent = cardsdrawn + " card drawn";
                console.log('card drawn successfully ' + cardsdrawn);
                document.getElementById("drawn_counter").textContent = cardsdrawn + " drawn";
            }

            //var for number of times rolled
            var dicerolled = 0;

            /*button click for roll dice*/
            RDB.addEventListener('click', rollDice);
            /*roll dice function*/
            function rollDice() {
                //alert('DICE ROLL');
                console.log('dice roll button pressed');
                dicerolled = dicerolled + 1;
                document.getElementById("rolled_counter").textContent = dicerolled + " rolled";
            }
            
            //displays the number rolled by the simple dice. first fully functional game element on my site... kinda proud
            RDB.addEventListener('click', diceTalk);
            function diceTalk() {
                var result = 0;
                var result = Math.floor(Math.random() *6) + 1;
                document.getElementById('dice_display').textContent = result;
                console.log('number returned = ' + result);
            }
            
            const cardsfilepath = '/test_cards.csv'
            //attempt at using papaparse... it returns as the function should per the documentation, but 
            //is not registering the actual contents of the test CSV or any other CSV I test it on. 
            //I should probably do this with JSON and populate an array or something
            Papa.parse(cardsfilepath, {
                delimiter:"",
                newline:"",
                header: true,
                download: false,
                complete: function(results, file) {
                    console.log(results);
                    data = results.data;
                }
            });
        }
        //};

    
        
