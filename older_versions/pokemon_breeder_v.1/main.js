$(document).ready(function () {
    //add click handler to intro screen to start initalizeGame function
    initializeGame();
});

//LOOK AT HOW CHECK HANDLER ON AND OFF WORKS!!!

var pokeball_id_swapper = true;
var first_pokeball_already_chosen = false;
var random_pokeballs_generated = [];
var first_owner_flag = '';
var second_owner_flag = '';
var first_pokemon = '';
var second_pokemon = '';
// var matched_pokemon = '';
var pokeball_move_flag = false;
var pokeball_check_flag = false;
var pokeball_opened_disable_check_flag = true;
var score = 0;

function removeIntroScreen() {

}

function initializeGame() {
    generateRandomPokeballs();
    selectPokeball('left');
    attachScoreScreenHandler();
    setTimeout(attachMoveHandler, 700);
    setTimeout(attachCheckHandler, 700);
    $('#message-screen').text('Open first Pokeball!');
}

function attachScoreScreenHandler() {
    $('body').on('keydown', function (e) {
        if (e.keyCode == "38") {
            $('.pokemon_pair_screen').animate({
                top: '10%'
            });
        }
        if (e.keyCode == "40") {
            $('.pokemon_pair_screen').animate({
                top: '100%'
            }, function () {
                $('.pokemon_pair_screen').clearQueue();
            });
        }
    })
}

function attachMoveHandler() {
    $('body').on('keydown', function (e) {
        if (pokeball_move_flag && e.keyCode == "37") {
            pokeball_move_flag = false;
            pokeball_check_flag = false;
            stashPokeball('left');
            pokeball_id_swapper = !pokeball_id_swapper;
            selectPokeball('left');
            if (first_pokeball_already_chosen === false) {
                $('#message-screen').text('Open first Pokeball!');
            }
        }
        if (pokeball_move_flag && e.keyCode == "39") {
            console.log('right');
            pokeball_move_flag = false;
            stashPokeball('right');
            pokeball_id_swapper = !pokeball_id_swapper;
            selectPokeball('right');
            if (first_pokeball_already_chosen === false) {
                $('#message-screen').text('Open first Pokeball!');
            }


        }

    })
}

function attachCheckHandler() {
    $('body').on('keydown', function (e) {
        if (pokeball_opened_disable_check_flag && pokeball_check_flag && e.keyCode == "13") {
            pokeball_opened_disable_check_flag = false;
            pokeball_check_flag = false;

            openPokeball();

            if (first_pokeball_already_chosen) {
                checkPokemonPair();
            } else {
                saveFirstPokemon();
            }

            // setTimeout(attachMoveHandler, 500);
            // setTimeout(attachCheckHandler, 500);
        }
    })
}

function bringPokeball(pokeball, direction) {
    pokeball_opened_disable_check_flag = true;
    var pokeball_container = $('.pokeball_screen_container');
    $(pokeball_container).append(pokeball);
    if (direction === 'left') {
        $(pokeball).css('right', '0').animate({
            opacity: 1,
        }, function () {
            $(pokeball).animate({
                right: "32%"
            }, function () {
                pokeball_move_flag = true;
                pokeball_check_flag = true;
            })
        });
    } else {
        $(pokeball).css('right', '64%').animate({
            opacity: 1,
        }, function () {
            $(pokeball).animate({
                right: "32%"
            }, function () {
                pokeball_move_flag = true;
                pokeball_check_flag = true;
            })
        });
    }

    var pokeball_index = random_pokeballs_generated.length - 1;
    if (random_pokeballs_generated[pokeball_index]['status'] === 'popped') {
        if (pokeball_id_swapper) {
            var pokemon = $('#pokemon-one');
        } else {
            var pokemon = $('#pokemon-two');
        }
        $(pokemon).animate({
            opacity: 1
        });
        pokeball_opened_disable_check_flag = false;
    }

    animatePokeballOwner(pokeball);
}

function stashPokeball(direction) {
    if (pokeball_id_swapper) {
        var to_stash_pokeball = $('#pokeball-one-container');
    } else {
        var to_stash_pokeball = $('#pokeball-two-container');
    }

    if (direction === 'left') {
        $(to_stash_pokeball).animate({
            left: 0
        }, function () {
            $(to_stash_pokeball).animate({
                opacity: 0
            }, function () {
                $(to_stash_pokeball).remove();
            })
        });
    } else {
        $(to_stash_pokeball).animate({
            left: '64%'
        }, function () {
            $(to_stash_pokeball).animate({
                opacity: 0
            }, function () {
                $(to_stash_pokeball).remove();
            })
        });
    }

}

function openPokeball() {
    if (pokeball_id_swapper) {
        var pokemon = $('#pokemon-one');
    } else {
        var pokemon = $('#pokemon-two');
    }
    $(pokemon).animate({
        opacity: 1
    });
}

function animatePokeballOwner(pokeball) {
    if ($(pokeball).hasClass('ash')) {
        first_owner_flag = 'ash';
    } else {
        first_owner_flag = 'misty';
    }

    if (first_owner_flag === 'ash' && second_owner_flag !== 'ash') {
        showAsh();
        hideMisty();
    } else if (first_owner_flag === 'ash' && second_owner_flag === 'ash') {
        blinkAsh();
    } else if (first_owner_flag === 'misty' && second_owner_flag !== 'misty') {
        showMisty();
        hideAsh();
    } else {
        blinkMisty();
    }

    second_owner_flag = first_owner_flag;
}

function showAsh() {
    $('.ash_image').animate({
        top: '10%'
    });
}

function blinkAsh() {
    $('.ash_image').fadeOut(300).fadeIn(300);
}

function hideAsh() {
    $('.ash_image').animate({
        top: '100%'
    });
}

function showMisty() {
    $('.misty_image').animate({
        bottom: '10%'
    });
}

function blinkMisty() {
    $('.misty_image').fadeOut(300).fadeIn(300);
}

function hideMisty() {
    $('.misty_image').animate({
        bottom: '100%'
    });
}

//script
function generateRandomPokeballs() {

    var pokeballs_generated = [];

    var pokemon_owner_set = ['ash', 'misty'];
    var pokeball_set = ['pokeball', 'greatball', 'ultraball', 'masterball'];
    var pokemon_set = ['blastoise-1', 'blastoise-2', 'charizard-1', 'charizard-2', 'venusaur-1', 'venusaur-2', 'pidgeot-1', 'pidgeot-2'];

    for (var x = 0; x < pokeball_set.length; x++) {

        var random_pokemon_index = Math.floor(Math.random() * pokemon_set.length);
        var random_pokemon_selected = pokemon_set[random_pokemon_index];
        pokemon_set.splice(random_pokemon_index, 1);

        var random_pokemon_index_2 = Math.floor(Math.random() * pokemon_set.length);
        var random_pokemon_selected_2 = pokemon_set[random_pokemon_index_2];
        pokemon_set.splice(random_pokemon_index_2, 1);

        var ash_pokeball_generated = {
            owner: pokemon_owner_set[0],
            type: pokeball_set[x],
            pokemon: random_pokemon_selected,
            status: 'closed'
        };

        var misty_pokeball_generated = {
            owner: pokemon_owner_set[1],
            type: pokeball_set[x],
            pokemon: random_pokemon_selected_2,
            status: 'closed'
        };

        pokeballs_generated.push(ash_pokeball_generated);
        pokeballs_generated.push(misty_pokeball_generated);
    }

    var counter = 0;

    for (var times in pokeballs_generated) {
        counter++;
    }


    for (var x = 0; x < counter; x++) {
        var random_pokeball_index = Math.floor(Math.random() * pokeballs_generated.length);
        var random_pokeball_selected = pokeballs_generated[random_pokeball_index];
        random_pokeballs_generated.push(random_pokeball_selected);
        pokeballs_generated.splice(random_pokeball_index, 1);
    }

    // var clone = JSON.parse(JSON.stringify(random_pokeballs_generated));

}


function selectPokeball(direction) {

    var id = '';
    if (pokeball_id_swapper) {
        id = 'one';
    } else {
        id = 'two';
    }

    var pokeball_container = $("<div>", {
        id: 'pokeball-' + id + '-container',
        class: 'pokeball_selected'
    });

    var pokeball_selected = $("<div>", {
        id: 'pokeball-' + id
    });

    var pokemon_selected = $("<div>", {
        id: 'pokemon-' + id
    });

    pokeball_container.append(pokeball_selected).append(pokemon_selected);

    if (direction === 'left') {
        var pokeball_properties = random_pokeballs_generated[0];
        var owner = pokeball_properties['owner'];
        var pokeball_type = pokeball_properties['type'];
        var pokemon_inside = pokeball_properties['pokemon'];

        pokeball_container.addClass(owner);
        pokeball_selected.addClass(pokeball_type);

        // pokeball_selected.addClass(function () {
        //     return owner + ' ' + pokeball_type
        // });

        pokemon_selected.addClass(pokemon_inside);

        var pokeball_on_screen = random_pokeballs_generated.shift();
        random_pokeballs_generated.push(pokeball_on_screen);

        bringPokeball(pokeball_container, 'left');
    } else {
        var pokeball_properties = random_pokeballs_generated[random_pokeballs_generated.length - 2];
        var owner = pokeball_properties['owner'];
        var pokeball_type = pokeball_properties['type'];
        var pokemon_inside = pokeball_properties['pokemon'];

        pokeball_container.addClass(owner);
        pokeball_selected.addClass(pokeball_type);

        pokemon_selected.addClass(pokemon_inside);

        var pokeball_on_screen = random_pokeballs_generated.pop();
        random_pokeballs_generated.unshift(pokeball_on_screen);

        bringPokeball(pokeball_container, 'right');
    }
}

function saveFirstPokemon() {

    var pokeball_index = random_pokeballs_generated.length - 1;

    first_pokemon = random_pokeballs_generated[pokeball_index]['pokemon'];
    random_pokeballs_generated[pokeball_index]['status'] = 'popped';

    first_pokeball_already_chosen = true;

    $('#message-screen').text('Find the second ' + first_pokemon.split('-')[0].charAt(0).toUpperCase() + first_pokemon.split('-')[0].slice(1));

    // $('#message-screen').text('hooray');

    // if (pokeball_id_swapper) {
    //     var to_check_pokeball = $('#pokeball-one-container');
    //     var first_pokemon = $(to_check_pokeball).find('#pokemon-one').attr('class');
    //     console.log('pokemon: ', pokemon);
    // } else {
    //     var to_check_pokeball = $('#pokeball-two-container');
    //     var first_pokemon = $(to_check_pokeball).find('#pokemon-two').attr('class');
    //     console.log('first pokemon: ', pokemon);
    // }
    //
    // var pokeball_in_array;
    //
    // for(var x = 0; x<random_pokeballs_generated.length; x++) {
    //     var check_pokemon = random_pokeballs_generated[x]['pokemon'];
    //     if (first_pokemon === check_pokemon) {
    //         // pokeball_in_array = x;
    //         console.log(x);
    //     }
    // }
    // console.log(random_pokeballs_generated);


}

function checkPokemonPair() {
    var pokeball_index = random_pokeballs_generated.length - 1;

    second_pokemon = random_pokeballs_generated[pokeball_index]['pokemon'];
    random_pokeballs_generated[pokeball_index]['status'] = 'popped';

    var pokemon_for_message = first_pokemon.split('-')[0].charAt(0).toUpperCase() + first_pokemon.split('-')[0].slice(1);

    if (first_pokemon.split('-')[0] === second_pokemon.split('-')[0]) {
        score++;
        $('#message-screen').text('You found the second ' + pokemon_for_message);
        storeCorrectMatches(first_pokemon.split('-')[0]);
        // alert('correct match');
        // matched_pokemon = first_pokemon.split('-')[0];
    } else {
        $('#message-screen').text('That is not the second ' + pokemon_for_message);
        for (var x = 0; x < random_pokeballs_generated.length; x++) {
            if (random_pokeballs_generated[x]['pokemon'] === first_pokemon || random_pokeballs_generated[x]['pokemon'] === second_pokemon) {
                random_pokeballs_generated[x]['status'] = 'closed';
            }
        }
    }
    first_pokemon = '';
    second_pokemon = '';
    first_pokeball_already_chosen = false;

}

function storeCorrectMatches(matched_pokemon) {
    var pokemon_baby = '';
    switch (matched_pokemon) {
        case 'charizard':
            pokemon_baby = 'charmander';
            break;
        case 'blastoise':
            pokemon_baby = 'squirtle';
            break;
        case 'venusaur':
            pokemon_baby = 'bulbasaur';
            break;
        case 'pidgeot':
            pokemon_baby = 'pidgey';
    }

    var image_url_string = `url('images/${pokemon_baby}.png')`;
    $('#slot' + score).css('background-image', image_url_string);
}

function resetGame() {

}