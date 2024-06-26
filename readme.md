# Marshmallow Madness

## Game Description

Marshmallow Madness is a whimsical and entertaining web-based game that combines elements of platforming, action, and strategy. Set in a world where confectionery comes to life, players control a heroic Squishmallow character on a mission to save miniature Stay-Puft marshmallow villages from the wrath of a villainous mug of hot cocoa.

### Concept

In this delightful game, players navigate through various levels filled with marshmallow and cocoa-themed hazards, power-ups, and challenges. The hero, a brave Squishmallow, must outmaneuver the hot cocoa villain while rescuing marshmallow villagers and collecting power-ups to enhance their abilities.

### Target Audience

Marshmallow Madness is designed to appeal to casual gamers, particularly those around 13 years old. However, its charming theme and engaging gameplay make it enjoyable for players of all ages who appreciate a fun, light-hearted gaming experience.

## Current Implementation

### Game Elements

1. **Hero (Player Character)**: A Squishmallow represented by a pink rectangle (60x60 pixels) that can move left, right, and jump. The hero rotates while moving, adding a playful touch to the character's movement.

2. **Villain**: A mug of hot cocoa represented by a brown rectangle (60x80 pixels) that moves autonomously and poses a threat to the player and villagers. The villain wobbles as it moves, creating a dynamic and menacing presence.

3. **Platforms**: Graham cracker-themed platforms (using the 'ground' sprite) for the player to navigate. There are currently four platforms strategically placed in the game world.

4. **Marshmallow Villagers**: Small white circles (10 pixels in radius) scattered throughout the level. There are 12 villagers in the current implementation.

5. **Candy Cane Power-ups**: Red rectangles (10x30 pixels) that the player can collect. There are 5 candy canes in the current implementation. (Functionality to be implemented in future updates)

6. **Hot Cocoa Drips**: Occasional brown circles (5 pixels in radius) that drop from the villain, adding to the hazardous environment. These drips disappear upon contact with platforms.

### Game Mechanics

- **Physics**: The game uses Phaser's Arcade Physics system, with gravity set to 300.
- **Collisions**: Collisions are implemented between the player, villain, villagers, candy canes, and platforms.
- **Villain Movement**: The hot cocoa villain moves autonomously with random initial velocity and bounces off the game boundaries.
- **Hero Movement**: The player can move left and right, jump when touching the ground, and rotates while moving for added visual interest.

### Controls

- **Keyboard**: Arrow keys for movement (left, right) and jumping (up)
- **Touch Controls**: On-screen buttons for left, right, and jump actions, making the game playable on tablets and mobile devices

### Technical Details

- Built using Phaser 3.80.1 game framework
- Utilizes HTML5 canvas for rendering
- Implements Arcade Physics for character movement and collisions
- Responsive design to fit various screen sizes

## Planned Features and Enhancements

As we progress through the game development project, we plan to implement the following features and enhancements:

1. **Improved Graphics**: 
   - Replace placeholder shapes with themed sprites and animations
   - Create a cohesive art style that reflects the marshmallow and cocoa theme
   - Implement parallax backgrounds for added depth

2. **Level Design**: 
   - Create multiple levels with increasing difficulty and unique layouts
   - Introduce themed obstacles like chocolate rivers or marshmallow quicksand
   - Design secret areas and shortcuts for advanced players

3. **Power-up System**: 
   - Implement functionality for candy cane power-ups, such as:
     - Temporary invincibility
     - Speed boosts
     - Double jump ability
     - Size changes (grow larger to smash through obstacles or shrink to access tight spaces)

4. **Hazards**: 
   - Add various themed hazards like:
     - Puddles of hot cocoa that can partially melt the hero
     - Cinnamon stick spikes
     - Whipped cream geysers that propel the player
     - Marshmallow toasters that the player must avoid

5. **Scoring System**: 
   - Implement a point system based on:
     - Rescued villagers
     - Collected power-ups
     - Time taken to complete levels
     - Consecutive jumps or stunts performed

6. **Sound Effects and Music**: 
   - Add themed audio to enhance the gaming experience:
     - Squish sounds for jumping
     - Slurping sounds for the hot cocoa villain
     - Cheerful background music with a confectionery twist

7. **Boss Battles**: 
   - Introduce challenging encounters with the hot cocoa villain at the end of levels
   - Create unique boss mechanics, such as dodging giant marshmallow projectiles or using environmental objects to defeat the boss

8. **Character Customization**: 
   - Allow players to modify their Squishmallow hero's appearance
   - Unlock new skins or accessories as players progress through the game

9. **Special Abilities**: 
   - Give the hero unique powers, such as:
     - Marshmallow inflation for floating
     - Cocoa absorption for temporary invincibility
     - Sugar rush for burst of speed
     - Sticky marshmallow form to climb walls

10. **Environmental Interactions**: 
    - Implement interactive elements like:
      - Stretchy marshmallow trampolines
      - Chocolate syrup slides
      - Cotton candy clouds that dissolve after being stepped on
      - Candy cane hooks for swinging

11. **Time-based Challenges**: 
    - Add timed levels or speed-run modes for additional gameplay variety
    - Implement a day/night cycle that affects gameplay mechanics

12. **Multiplayer Mode**: 
    - Develop a cooperative mode where players work together to save villagers
    - Create a competitive mode where players race to collect the most power-ups or rescue the most villagers

13. **Achievements and Unlockables**: 
    - Create a system of achievements to encourage replayability
    - Unlock new content such as levels, characters, or game modes based on player accomplishments

14. **Story Mode**: 
    - Develop a narrative-driven campaign with cutscenes and character dialogues
    - Create a rich backstory for the conflict between the Squishmallow hero and the hot cocoa villain

15. **Mobile Optimization**: 
    - Further refine touch controls for better responsiveness on mobile devices
    - Implement gesture controls for more intuitive mobile gameplay
    - Optimize performance and file size for smooth mobile play

16. **Procedural Level Generation**: 
    - Create an algorithm to generate unique levels each playthrough, ensuring high replayability

17. **Weather Effects**: 
    - Implement weather systems like chocolate rain or sugar snow that affect gameplay mechanics

18. **Mini-games**: 
    - Introduce small, themed mini-games between levels to break up the main gameplay and offer variety

19. **Social Features**: 
    - Add leaderboards for comparing scores with friends
    - Implement a level sharing system for user-generated content

20. **Accessibility Options**: 
    - Include features like colorblind modes, adjustable text sizes, and customizable controls to make the game more accessible to all players

## How to Play

1. Use the arrow keys (on desktop) or touch controls (on mobile devices) to move the Squishmallow hero.
2. Navigate through the platforms, avoiding the hot cocoa villain and its drips.
3. Jump on platforms to reach higher areas and avoid hazards.
4. (Coming soon) Collect candy cane power-ups and rescue marshmallow villagers to score points.
5. (Coming soon) Survive as long as possible while achieving the highest score.

## Development Roadmap

1. **Phase 1 (Current)**: Basic game mechanics and controls
   - Implement core gameplay elements (player movement, platforms, villain)
   - Set up basic physics and collisions
   - Create touch controls for mobile play

2. **Phase 2**: Graphics overhaul and sound implementation
   - Replace placeholder graphics with themed sprites
   - Add animations for characters and objects
   - Implement background music and sound effects

3. **Phase 3**: Power-up system and hazard introduction
   - Develop the candy cane power-up functionality
   - Introduce various hazards to increase gameplay complexity
   - Implement the scoring system

4. **Phase 4**: Level design and progression system
   - Create multiple levels with increasing difficulty
   - Implement a level selection screen
   - Add a progression system to unlock new levels and features

5. **Phase 5**: Advanced features
   - Develop boss battles
   - Implement special abilities for the hero
   - Create environmental interactions

6. **Phase 6**: Polish, optimization, and additional game modes
   - Refine gameplay based on user feedback
   - Optimize performance for various devices
   - Add new game modes (time attack, endless mode, etc.)

## Technical Requirements

- Modern web browser with JavaScript enabled
- Internet connection (for loading assets and potential future online features)
- Touch-screen device for mobile play (optional)
