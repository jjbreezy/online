/*ensures everything happens AFTER page load*/
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
            function cardFunction() {
                //alert('NEW CARD');
                console.log('new card button pressed');
            }

            // global variable to display the number of cards drawn
            var cardsdrawn = 0;

            NCB.addEventListener('click', drawCard);
            //random card
            function drawCard() {
                cardsdrawn = cardsdrawn + 1
                document.getElementById("card_display").textContent = cardsdrawn + " card drawn";
                console.log('card drawn successfully');
            }

            /*button click for roll dice*/
            RDB.addEventListener('click', rollDice);
            /*roll dice function*/
            function rollDice() {
                //alert('DICE ROLL');
                console.log('dice roll button pressed');
            }
            
            RDB.addEventListener('click', diceTalk);
            function diceTalk() {
                var result = 0;
                var result = Math.floor(Math.random() *6) + 1;
                document.getElementById('dice_display').textContent = result;
                console.log('number returned = ' + result);
            }
            
        }
        //};

