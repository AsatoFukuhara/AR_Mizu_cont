
// move.ts

/*
export class Move {
    moveObject() {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 's':
                    group.position.z -= 1;
                    break;
                case 'w':
                    group.position.z += 1;
                    break;
                case 'a':
                    group.position.x -= 1;
                    break;
                case 'd':
                    group.position.x += 1;
                    break;
            }
        });
    }
}
*/

// Move.ts

import { group } from './AREngine';

export class Move {
  moveUp() {
    group.position.z += 1;
  }

  moveDown() {
    group.position.z -= 1;
  }

  moveLeft() {
    group.position.x -= 1;
  }

  moveRight() {
    group.position.x += 1;
  }
}

