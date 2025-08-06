import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-snowflake',
  templateUrl: './snowflake.component.html',
  styleUrls: ['./snowflake.component.css']
})
//'❅', '❆', '❃'
export class SnowflakeComponent implements OnInit {
  emojiCollection = ['1','2','3','4','5','6','7','8','9'];
  particles = 10; // Total snowflakes to appear over time
  innerWidth = window.innerWidth;

  constructor(private renderer: Renderer2, public el: ElementRef) {}

  ngOnInit(): void {
    this.startSnowfall();
    window.addEventListener('resize', () => {
      this.innerWidth = window.innerWidth;
    });
  }

  startSnowfall() {
    let createdParticles = 0;

    // Add snowflakes gradually
    const interval = setInterval(() => {
      if (createdParticles >= this.particles) {
        clearInterval(interval);
        return;
      }
      this.createParticle();
      createdParticles++;
    }, 150); // Add one snowflake every 150ms (adjust for faster or slower snow)

    // Optional: Continuous snowfall (looping)
    setInterval(() => {
      this.createParticle();
    }, 500); // Add snowflakes every 500ms after initial particles are created
  }

  createParticle() {
    const randomEmoji = this.emojiCollection[Math.floor(Math.random() * this.emojiCollection.length)];
    const emojiLeftPosition = Math.random() * this.innerWidth; // Random left position

    const span = this.renderer.createElement('span');
    const text = this.renderer.createText(randomEmoji);

    this.renderer.appendChild(span, text);
    this.renderer.addClass(span, 'snowflake');
    this.renderer.setStyle(span, 'left', emojiLeftPosition + 'px');
    this.renderer.setStyle(span, 'animation-duration', this.randomMinMax(3, 5.0) + 's');
    this.renderer.setStyle(span, 'animation-delay', '0s'); // Immediate effect

    // Clean up DOM after animation ends
    this.renderer.setStyle(span, 'animation-fill-mode', 'forwards');
    this.renderer.setStyle(span, 'top', '0px'); // Start at the top
    this.renderer.appendChild(this.el.nativeElement, span);

    span.addEventListener('animationend', () => {
      this.el.nativeElement.removeChild(span); // Remove snowflake after animation
    });
  }

  randomMinMax(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
