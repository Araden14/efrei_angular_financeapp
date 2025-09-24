import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAnimate]',
  standalone: true
})
export class AnimateDirective {
  @Input() appAnimate: 'pulse' | 'bounce' | 'shake' | 'scale' | 'glow' = 'pulse';
  @Input() animationTrigger: 'hover' | 'click' | 'both' = 'both';
  @Input() animationDuration: string = '300ms';

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.setupBaseStyles();
  }

  private setupBaseStyles(): void {
    this.renderer.setStyle(this.el.nativeElement, 'transition', `all ${this.animationDuration} ease-in-out`);
    this.renderer.setStyle(this.el.nativeElement, 'transform-origin', 'center');
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.animationTrigger === 'hover' || this.animationTrigger === 'both') {
      this.playAnimation();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.animationTrigger === 'hover' || this.animationTrigger === 'both') {
      this.resetAnimation();
    }
  }

  @HostListener('mousedown')
  onMouseDown(): void {
    if (this.animationTrigger === 'click' || this.animationTrigger === 'both') {
      this.playClickAnimation();
    }
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    if (this.animationTrigger === 'click' || this.animationTrigger === 'both') {
      setTimeout(() => {
        this.resetAnimation();
      }, 150);
    }
  }

  private playAnimation(): void {
    const element = this.el.nativeElement;
    
    switch (this.appAnimate) {
      case 'pulse':
        this.renderer.setStyle(element, 'transform', 'scale(1.05)');
        this.renderer.setStyle(element, 'box-shadow', '0 8px 25px rgba(0, 0, 0, 0.15)');
        break;
      
      case 'bounce':
        this.renderer.setStyle(element, 'transform', 'translateY(-3px)');
        this.renderer.setStyle(element, 'box-shadow', '0 6px 20px rgba(0, 0, 0, 0.15)');
        break;
      
      case 'scale':
        this.renderer.setStyle(element, 'transform', 'scale(1.1)');
        break;
      
      case 'glow':
        this.renderer.setStyle(element, 'box-shadow', '0 0 20px rgba(59, 130, 246, 0.5)');
        this.renderer.setStyle(element, 'transform', 'scale(1.02)');
        break;
      
      case 'shake':
        this.playShakeAnimation();
        break;
    }
  }

  private playClickAnimation(): void {
    const element = this.el.nativeElement;
    this.renderer.setStyle(element, 'transform', 'scale(0.98)');
    this.renderer.setStyle(element, 'filter', 'brightness(0.95)');
  }

  private playShakeAnimation(): void {
    const element = this.el.nativeElement;
    const keyframes = [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(0)' }
    ];
    
    element.animate(keyframes, {
      duration: parseInt(this.animationDuration),
      easing: 'ease-in-out'
    });
  }

  private resetAnimation(): void {
    const element = this.el.nativeElement;
    this.renderer.removeStyle(element, 'transform');
    this.renderer.removeStyle(element, 'box-shadow');
    this.renderer.removeStyle(element, 'filter');
  }

  // Public method to trigger animations programmatically
  public triggerAnimation(animationType?: 'pulse' | 'bounce' | 'shake' | 'scale' | 'glow'): void {
    if (animationType) {
      this.appAnimate = animationType;
    }
    
    this.playAnimation();
    
    setTimeout(() => {
      this.resetAnimation();
    }, parseInt(this.animationDuration));
  }
}
