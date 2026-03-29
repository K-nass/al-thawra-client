declare module 'react-pageflip' {
  import React from 'react';

  interface IFlipSetting {
    startPage?: number;
    size?: 'fixed' | 'stretch';
    width: number;
    height: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    swipeDistance?: number;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    renderOnlyPageLengthChange?: boolean;
    disableFlipByClick?: boolean;
  }

  interface FlipEvent {
    data: number | string;
    object: any;
  }

  interface HTMLFlipBookProps extends IFlipSetting {
    style?: React.CSSProperties;
    className?: string;
    children: React.ReactNode;
    onFlip?: (e: FlipEvent) => void;
    onChangeOrientation?: (e: FlipEvent) => void;
    onChangeState?: (e: FlipEvent) => void;
    onInit?: (e: FlipEvent) => void;
    onUpdate?: (e: FlipEvent) => void;
  }

  export default class HTMLFlipBook extends React.Component<HTMLFlipBookProps> {
    pageFlip(): {
      flipNext(corner?: 'top' | 'bottom'): void;
      flipPrev(corner?: 'top' | 'bottom'): void;
      flip(pageNum: number, corner?: 'top' | 'bottom'): void;
      turnToPage(pageNum: number): void;
      turnToNextPage(): void;
      turnToPrevPage(): void;
      getCurrentPageIndex(): number;
      getPageCount(): number;
      getOrientation(): 'portrait' | 'landscape';
      loadFromImages(images: string[]): void;
      destroy(): void;
    };
  }
}
