//= require "canvas_object.class"

(function(){
  
  var fabric = this.fabric || (this.fabric = { });
  
  if (fabric.Rect) {
    return;
  }
  
  /** 
   * @class Rect
   * @extends fabric.Object
   */
  fabric.Rect = fabric.base.createClass(fabric.Object, /** @lends fabric.Rect.prototype */ {
    
    type: 'rect',
    
    options: {
      rx: 0,
      ry: 0
    },
    
    /**
     * @constructs
     * @method initialize
     * @param options {Object} options object
     * @return {Object} thisArg
     */
    initialize: function(options) {
      this.callSuper('initialize', options);
      this._initRxRy();
    },
    
    /**
     * @private
     * @method _initRxRy
     */
    _initRxRy: function() {
      if (this.options.rx && !this.options.ry) {
        this.options.ry = this.options.rx;
      }
      else if (this.options.ry && !this.options.rx) {
        this.options.rx = this.options.ry;
      }
    },
    
    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {   
      var rx = this.options.rx || 0,
          ry = this.options.ry || 0,
          x = -this.width / 2,
          y = -this.height / 2,
          w = this.width,
          h = this.height;
      
      ctx.beginPath();
      ctx.moveTo(x+rx, y);
      ctx.lineTo(x+w-rx, y);
      ctx.bezierCurveTo(x+w, y, x+w, y+ry, x+w, y+ry);
      ctx.lineTo(x+w, y+h-ry);
      ctx.bezierCurveTo(x+w,y+h,x+w-rx,y+h,x+w-rx,y+h);
      ctx.lineTo(x+rx,y+h);
      ctx.bezierCurveTo(x,y+h,x,y+h-ry,x,y+h-ry);
      ctx.lineTo(x,y+ry);
      ctx.bezierCurveTo(x,y,x+rx,y,x+rx,y);
      ctx.closePath();
      
      if (this.fill) {
        ctx.fill();
      }
      if (this.stroke) {
        ctx.stroke();
      }
    },
    
    // since our coordinate system differs from that of SVG
    _normalizeLeftTopProperties: function(parsedAttributes) {
      if (parsedAttributes.left) {
        this.set('left', parsedAttributes.left + this.getWidth() / 2);
      }
      if (parsedAttributes.top) {
        this.set('top', parsedAttributes.top + this.getHeight() / 2);
      }
      return this;
    },
    
    /**
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    }
  });
  
  // TODO (kangax): implement rounded rectangles (both parsing and rendering)
  fabric.Rect.ATTRIBUTE_NAMES = 'x y width height rx ry fill fill-opacity stroke stroke-width transform'.split(' ');
  
  /**
   * @private
   */
  function _setDefaultLeftTopValues(attributes) {
    attributes.left = attributes.left || 0;
    attributes.top  = attributes.top  || 0;
    return attributes;
  }
  
  /**
   * @static
   * @method fabric.Rect.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @return {Object} instance of fabric.Rect
   */
  fabric.Rect.fromElement = function(element, options) {
    if (!element) {
      return null;
    }
    
    var parsedAttributes = fabric.parseAttributes(element, fabric.Rect.ATTRIBUTE_NAMES);
    parsedAttributes = _setDefaultLeftTopValues(parsedAttributes);
    
    var rect = new fabric.Rect(fabric.base.object.extend(options || { }, parsedAttributes));
    rect._normalizeLeftTopProperties(parsedAttributes);
    
    return rect;
  };
  
  /**
   * @static
   * @method fabric.Rect.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of fabric.Rect
   */
  fabric.Rect.fromObject = function(object) {
    return new fabric.Rect(object);
  };
})();