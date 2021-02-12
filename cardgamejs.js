/*ensures everything happens AFTER page load*/
//really have a strange suspicion that doing all of my JS inside this will cause some kind of issue but I don't know what 
//that issue might be, only that async functions are valuable for JS soooo 
        window.onload = function() {
            console.log('page loaded');

            /*first time page load message*/
            if (!('hasCodeRunBefore' in localStorage)) {
                alert('Welcome to Blackout! This game contains explicit content inappropriate for those under the age of 18. The minimum legal drinking age in the United States is 21 years. Please drink responsibly.');
                localStorage.setItem('hasCodeRunBefore', true);
                console.log('first time user welcomed')
            }
            else {
                //alert('Back so soon? Please drink responsibly.');
                console.log('repeat user');
            }
            
            var NCB = document.getElementById('newCardButton');
            var RDB = document.getElementById('rollDiceButton');
            
            var jsontestdeck = [];
            //JSON test deck fetch
            fetch("test_cards.json")
                .then(response => response.json())
                .then(data => {
                    jsontestdeck = data;
                    console.log(jsontestdeck);
                });

            /*button click for new card*/
            NCB.addEventListener('click', cardFunction);
            /*new card draw function*/
            function cardFunction() {
                console.log('card function triggered');
                //local variable for randomly drawn card 
                let randomlydrawncard = jsontestdeck[Math.floor(Math.random() * jsontestdeck.length)];
                //log the card to ensure it's all good
                console.log(randomlydrawncard);
                document.getElementById("card_display").textContent = JSON.stringify(randomlydrawncard.cardcontents);
            }

            //variable to display the number of cards drawn
            var cardsdrawn = 0;

            NCB.addEventListener('click', drawCard);
            
            //increases the number of cards drawn by one per each card drawn.
            function drawCard() {
                cardsdrawn = cardsdrawn + 1
                console.log('card drawn successfully ' + cardsdrawn);
                document.getElementById("drawn_counter").textContent = cardsdrawn + " drawn";
            }

            //var for number of times rolled
            var dicerolled = 0;

            /*button click for roll dice*/
            RDB.addEventListener('click', rollDice);
            /*roll dice function*/
            function rollDice() {
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
        }

