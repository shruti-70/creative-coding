import { animate } from 'animejs';

const [ $time, $count ] = utils.$('.value');

createTimer({
  duration: 1000,
  loop: true,
  frameRate: 30,
  onUpdate: self => $time.innerHTML = self.currentTime,
  onLoop: self => $count.innerHTML = self._currentIteration
});

function createTimer({ duration, loop, frameRate, onUpdate, onLoop }) {
  const timer = animate({
    targets: {},
    duration,
    loop,
    easing: 'linear',
    update: onUpdate,
    complete: onLoop,
    autoplay: true,
    delay: 0,
    begin: () => {
      console.log('Timer started');
    },
    end: () => {
      console.log('Timer ended');
    }
  });

  return timer;
} 