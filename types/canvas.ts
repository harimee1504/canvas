export type Color = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export type Point = {
    x: number;
    y: number;
};

export type XYWH = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export enum Side {
    Top = 1,
    Bottom = 2,
    Left = 4,
    Right = 8,
}

export type Camera = {
    x: number;
    y: number;
};

export enum ShapeType {
    Rectangle,
    Ellipse,
    Path,
    Text,
    StickyNote,
}

export type Rectangle = {
    type: ShapeType.Rectangle;
    x: number;
    y: number;
    width: number;
    height: number;
    color: Color;
    value?: string;
};

export type Ellipse = {
    type: ShapeType.Ellipse;
    x: number;
    y: number;
    width: number;
    height: number;
    color: Color;
    value?: string;
};

export type Path = {
    type: ShapeType.Path;
    x: number;
    y: number;
    width: number;
    height: number;
    color: Color;
    coordinates: number[][];
    value?: string;
};

export type Text = {
    type: ShapeType.Text;
    x: number;
    y: number;
    width: number;
    height: number;
    color: Color;
    value?: string;
};

export type StickyNote = {
    type: ShapeType.StickyNote;
    x: number;
    y: number;
    width: number;
    height: number;
    color: Color;
    value?: string;
};

export type CanvasState =
    | {
          mode: CanvasMode.Default;
      }
    | {
          mode: CanvasMode.Pressing;
          origin: Point;
      }
    | {
          mode: CanvasMode.Selection;
          origin: Point;
          current?: Point;
      }
    | {
          mode: CanvasMode.Dragging;
          current: Point;
      }
    | {
          mode: CanvasMode.Inserting;
          shapeType:
              | ShapeType.Ellipse
              | ShapeType.Rectangle
              | ShapeType.Text
              | ShapeType.StickyNote;
      }
    | {
          mode: CanvasMode.Resizing;
          initial: XYWH;
          side: Side;
      }
    | {
          mode: CanvasMode.Pencil;
      };

export enum CanvasMode {
    Default,
    Pressing,
    Selection,
    Dragging,
    Inserting,
    Resizing,
    Pencil,
}

export type Layer = Rectangle | Ellipse | Path | Text | StickyNote;
