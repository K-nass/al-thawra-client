import { createPluginRegistration } from '@embedpdf/core';
import {
  DocumentManagerPluginPackage,
} from '@embedpdf/plugin-document-manager/react';
import { ViewportPluginPackage } from '@embedpdf/plugin-viewport/react';
import { ScrollPluginPackage, ScrollStrategy } from '@embedpdf/plugin-scroll/react';
import { RenderPluginPackage } from '@embedpdf/plugin-render/react';
import { InteractionManagerPluginPackage } from '@embedpdf/plugin-interaction-manager/react';
import { ZoomPluginPackage, ZoomMode } from '@embedpdf/plugin-zoom/react';
import { PanPluginPackage } from '@embedpdf/plugin-pan/react';
import { ThumbnailPluginPackage } from '@embedpdf/plugin-thumbnail/react';
import { FullscreenPluginPackage } from '@embedpdf/plugin-fullscreen/react';
import { ExportPluginPackage } from '@embedpdf/plugin-export/react';
import { CapturePluginPackage } from '@embedpdf/plugin-capture/react';
import { PrintPluginPackage } from '@embedpdf/plugin-print/react';
import { RotatePluginPackage } from '@embedpdf/plugin-rotate/react';
import { SpreadPluginPackage, SpreadMode } from '@embedpdf/plugin-spread/react';

/**
 * Creates the embedpdf plugin registration array for the magazine viewer.
 * @param pdfUrl - The URL of the PDF document to load
 */
export function createViewerPlugins(pdfUrl: string) {
  return [
    createPluginRegistration(DocumentManagerPluginPackage, {
      initialDocuments: [{ url: pdfUrl }],
    }),
    createPluginRegistration(ViewportPluginPackage),
    createPluginRegistration(ScrollPluginPackage, {
      defaultStrategy: ScrollStrategy.Vertical,
      defaultPageGap: 10,
    }),
    createPluginRegistration(RenderPluginPackage),
    createPluginRegistration(InteractionManagerPluginPackage),
    createPluginRegistration(CapturePluginPackage, {
      scale: 2,
      imageType: 'image/png',
      withAnnotations: true,
    }),
    createPluginRegistration(ZoomPluginPackage, {
      defaultZoomLevel: ZoomMode.FitPage,
      minZoom: 0.25,
      maxZoom: 5,
    }),
    createPluginRegistration(SpreadPluginPackage, {
      defaultSpreadMode: SpreadMode.None,
    }),
    createPluginRegistration(RotatePluginPackage, {
      defaultRotation: 0,
    }),
    createPluginRegistration(PanPluginPackage, {
      defaultMode: 'never',
    }),
    createPluginRegistration(ThumbnailPluginPackage, {
      width: 140,
    }),
    createPluginRegistration(PrintPluginPackage),
    createPluginRegistration(FullscreenPluginPackage),
    createPluginRegistration(ExportPluginPackage),
  ];
}
