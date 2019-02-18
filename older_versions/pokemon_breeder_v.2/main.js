$(document).ready(function () {
    //add click handler to intro screen to start initalizeGame function
    initializeGame();
});

var pokeball_id_swapper = true;
var first_pokeball_already_chosen = false;
var random_pokeballs_generated = [];
var first_owner_flag = '';
var second_owner_flag = '';
var first_pokemon = '';
var second_pokemon = '';
var pokeball_move_flag = false;
var pokeball_check_flag = false;
var pokeball_opened_disable_check_flag = true;
var score = 0;

function initializeGame() {
    generateRandomPokeballs();
    selectPokeball('left');
    attachScoreScreenHandler();
    setTimeout(attachMoveHandler, 700);
    setTimeout(attachCheckHandler, 700);
    $('#message-screen').text('Select a Pokeball!');
}

///////EVENT HANDLERS FOR GAME INITIALIZATION///////

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
                $('#message-screen').text('Select a Pokeball!');
            }
        }
        if (pokeball_move_flag && e.keyCode == "39") {
            pokeball_move_flag = false;
            pokeball_check_flag = false;
            stashPokeball('right');
            pokeball_id_swapper = !pokeball_id_swapper;
            selectPokeball('right');
            if (!first_pokeball_already_chosen) {
                $('#message-screen').text('Select a Pokeball!');
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
            first_pokeball_already_chosen ? checkPokemonPair() : saveFirstPokemon();
        }
    })
}


///////ANIMATION FUNCTIONS///////

function removeIntroScreen() {

}

function bringPokeball(pokeball, direction) {
    $('.pokeball_screen_container').append(pokeball);
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
        var pokemon = pokeball_id_swapper ? $('#pokemon-one') : $('#pokemon-two');
        $(pokemon).animate({
            opacity: 1
        });
        pokeball_opened_disable_check_flag = false;
    } else {
        pokeball_opened_disable_check_flag = true;
    }

    animatePokeballOwner(pokeball);
}

function stashPokeball(direction) {

    var to_stash_pokeball = pokeball_id_swapper ? $('#pokeball-one-container') : $('#pokeball-two-container');

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

    var pokemon = pokeball_id_swapper ? $('#pokemon-one') : $('#pokemon-two');

    $(pokemon).animate({
        opacity: 1
    });
}

function animatePokeballOwner(pokeball) {

    first_owner_flag = $(pokeball).hasClass('ash') ? 'ash' : 'misty';

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

///////GAME LOGIC FUNCTIONS///////

function setPokeball(owner, type, pokemon, status) {
    this.owner = owner;
    this.type = type;
    this.pokemon = pokemon;
    this.status = status;
}

function generateRandomPokeballs() {

    var pokeballs_generated = [];
    var pokemon_owner_set = ['ash', 'misty'];
    var pokeball_set = ['pokeball', 'greatball', 'ultraball', 'masterball'];
    var pokemon_set = ['blastoise-1', 'blastoise-2', 'charizard-1', 'charizard-2', 'venusaur-1', 'venusaur-2', 'pidgeot-1', 'pidgeot-2'];


    ////Setup pokeballs into "pokeballs_generated" array
    for (var x = 0; x < pokeball_set.length; x++) {

        var random_pokemon_index = Math.floor(Math.random() * pokemon_set.length);
        var random_pokemon_selected = pokemon_set[random_pokemon_index];
        pokemon_set.splice(random_pokemon_index, 1);

        var random_pokemon_index_2 = Math.floor(Math.random() * pokemon_set.length);
        var random_pokemon_selected_2 = pokemon_set[random_pokemon_index_2];
        pokemon_set.splice(random_pokemon_index_2, 1);

        var ash_pokeball_generated = new setPokeball(pokemon_owner_set[0], pokeball_set[x], random_pokemon_selected, 'closed');

        var misty_pokeball_generated = new setPokeball(pokemon_owner_set[1], pokeball_set[x], random_pokemon_selected_2, 'closed');

        pokeballs_generated.push(ash_pokeball_generated);
        pokeballs_generated.push(misty_pokeball_generated);
    }

    ////Randomize the order of pokeballs in "pokeballs_generated" array
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
}


function selectPokeball(direction) {

    var id = pokeball_id_swapper ? 'one' : 'two';

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
        var pokeball_on_screen = random_pokeballs_generated.shift();
        random_pokeballs_generated.push(pokeball_on_screen);
    } else {
        var pokeball_properties = random_pokeballs_generated[random_pokeballs_generated.length - 2];
        var pokeball_on_screen = random_pokeballs_generated.pop();
        random_pokeballs_generated.unshift(pokeball_on_screen);
    }

    pokeball_container.addClass(pokeball_properties['owner']);
    pokeball_selected.addClass(pokeball_properties['type']);
    pokemon_selected.addClass(pokeball_properties['pokemon']);
    // pokeball_selected.addClass(function () {
    //     return owner + ' ' + pokeball_type
    // });

    direction === 'left' ? bringPokeball(pokeball_container, 'left') : bringPokeball(pokeball_container, 'right');
}

function saveFirstPokemon() {
    var pokeball_index = random_pokeballs_generated.length - 1;
    first_pokemon = random_pokeballs_generated[pokeball_index]['pokemon'];
    random_pokeballs_generated[pokeball_index]['status'] = 'popped';
    first_pokeball_already_chosen = true;

    $('#message-screen').text('Find the second ' + first_pokemon.split('-')[0].charAt(0).toUpperCase() + first_pokemon.split('-')[0].slice(1));
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
    } else {
        $('#message-screen').text('That is not the second ' + pokemon_for_message);
        random_pokeballs_generated.forEach(function (pokeball) {
            if (pokeball['pokemon'] === first_pokemon || pokeball['pokemon'] === second_pokemon) {
                pokeball['status'] = 'closed';
            }
        });
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