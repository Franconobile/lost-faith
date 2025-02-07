//=============================================================================
// ProximityAudio.js
//=============================================================================

/*:
 * @plugindesc Plays sounds with volume based on distance from events to player
 * @author Your Name
 *
 * @help
 * Plugin Commands:
 *   ProximityAudio soundName eventId maxDistance loop    # Starts proximity-based SE
 *   ProximityAudioBgs soundName eventId maxDistance      # Starts proximity-based BGS
 *   StopProximityAudio eventId                          # Stops SE for event
 *   StopProximityAudioBgs eventId                       # Stops BGS for event
 * 
 * Examples:
 *   ProximityAudio explosion 1 15 true     # Plays looping SE with 15 tile range
 *   ProximityAudioBgs river 2 20           # Plays BGS with 20 tile range
 */

(function() {
    var activeSounds = {};
    var activeBGS = {};
    
    // Plugin Command
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        
        if (command === 'ProximityAudio') {
            var soundName = args[0];
            var eventId = Number(args[1]);
            var maxDistance = args[2] ? Number(args[2]) : 10;
            var loop = args[3] && args[3].toLowerCase() === 'true';
            startProximitySound(soundName, eventId, loop, maxDistance);
        }
        if (command === 'ProximityAudioBgs') {
            var soundName = args[0];
            var eventId = Number(args[1]);
            var maxDistance = args[2] ? Number(args[2]) : 10;
            startProximityBGS(soundName, eventId, maxDistance);
        }
        if (command === 'StopProximityAudio') {
            var eventId = Number(args[0]);
            stopProximitySound(eventId);
        }
        if (command === 'StopProximityAudioBgs') {
            var eventId = Number(args[0]);
            stopProximityBGS(eventId);
        }
    };

    // Sound Effect Functions
    function startProximitySound(soundName, eventId, loop, maxDistance) {
        if (activeSounds[eventId]) {
            stopProximitySound(eventId);
        }

        var audio = new Audio('audio/se/' + soundName + '.ogg');
        audio.volume = 0;
        audio.loop = loop;
        
        activeSounds[eventId] = {
            name: soundName,
            audio: audio,
            isPlaying: true,
            maxDistance: maxDistance
        };

        audio.play().catch(function(error) {
            console.error("Sound playback failed:", error);
        });
    }

    function stopProximitySound(eventId) {
        if (activeSounds[eventId]) {
            if (activeSounds[eventId].audio) {
                activeSounds[eventId].audio.pause();
                activeSounds[eventId].audio.currentTime = 0;
            }
            delete activeSounds[eventId];
        }
    }

    function updateProximitySound(eventId) {
        if (!activeSounds[eventId] || !activeSounds[eventId].isPlaying) return;
        
        var event = $gameMap.event(eventId);
        if (!event) {
            stopProximitySound(eventId);
            return;
        }

        var distance = Math.sqrt(
            Math.pow($gamePlayer.x - event.x, 2) + 
            Math.pow($gamePlayer.y - event.y, 2)
        );

        var maxDistance = activeSounds[eventId].maxDistance || 10;
        var volume = Math.max(0, Math.min(100, 
            Math.floor((1 - (distance / maxDistance)) * 100)
        )) / 100;

        if (activeSounds[eventId].audio) {
            activeSounds[eventId].audio.volume = volume;
        }
    }

    // Background Sound Functions
    function startProximityBGS(soundName, eventId, maxDistance) {
        if (activeBGS[eventId]) {
            stopProximityBGS(eventId);
        }

        var audio = new Audio('audio/bgs/' + soundName + '.ogg');
        audio.volume = 0;
        audio.loop = true;
        
        activeBGS[eventId] = {
            name: soundName,
            audio: audio,
            isPlaying: true,
            maxDistance: maxDistance
        };

        audio.play().catch(function(error) {
            console.error("BGS playback failed:", error);
        });
    }

    function stopProximityBGS(eventId) {
        if (activeBGS[eventId]) {
            if (activeBGS[eventId].audio) {
                activeBGS[eventId].audio.pause();
                activeBGS[eventId].audio.currentTime = 0;
            }
            delete activeBGS[eventId];
        }
    }

    function updateProximityBGS(eventId) {
        if (!activeBGS[eventId] || !activeBGS[eventId].isPlaying) return;
        
        var event = $gameMap.event(eventId);
        if (!event) {
            stopProximityBGS(eventId);
            return;
        }

        var distance = Math.sqrt(
            Math.pow($gamePlayer.x - event.x, 2) + 
            Math.pow($gamePlayer.y - event.y, 2)
        );

        var maxDistance = activeBGS[eventId].maxDistance || 10;
        var volume = Math.max(0, Math.min(100, 
            Math.floor((1 - (distance / maxDistance)) * 100)
        )) / 100;

        if (activeBGS[eventId].audio) {
            activeBGS[eventId].audio.volume = volume;
        }
    }

    // Update Functions
    function updateAllProximitySounds() {
        for (var eventId in activeSounds) {
            updateProximitySound(Number(eventId));
        }
    }

    function updateAllProximityBGS() {
        for (var eventId in activeBGS) {
            updateProximityBGS(Number(eventId));
        }
    }

    // Scene Updates
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        updateAllProximitySounds();
        updateAllProximityBGS();
    };

    // Scene Cleanup
    var _Scene_Base_terminate = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        _Scene_Base_terminate.call(this);
        for (var eventId in activeSounds) {
            stopProximitySound(Number(eventId));
        }
        for (var eventId in activeBGS) {
            stopProximityBGS(Number(eventId));
        }
    };
})();