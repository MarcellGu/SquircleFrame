// components/squircle/squircle.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        borderRadius: {
            type: Number, value: 25
        }, fill: {
            type: String, value: '#ffffff'
        }, stroke: {
            type: String, value: '#000000'
        }, strokeWidth: {
            type: Number, value: 1
        }, width: {
            type: Number, value: 100
        }, height: {
            type: Number, value: 100
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 初始化 Canvas 并进行首次绘制
         */
        initCanvas() {
            const { pixelRatio } = wx.getWindowInfo();
            const query = this.createSelectorQuery();
            query.select('#squircleCanvas')
                .fields({node: true, size: true})
                .exec((res) => {
                    const canvas = res[0].node;
                    const ctx = canvas.getContext('2d');

                    // 存储 canvas 和 ctx 实例
                    this.canvas = canvas;
                    this.ctx = ctx;
                    
                    // 设置画布尺寸，以避免模糊
                    const dpr = pixelRatio;
                    canvas.width = res[0].width * dpr;
                    canvas.height = res[0].height * dpr;
                    ctx.scale(dpr, dpr);

                    // 首次绘制
                    this.draw();
                });
        },

        /**
         * 绘制 Squircle 形状
         */
        draw() {
            const {width, height, borderRadius, fill, stroke, strokeWidth} = this.data;
            const {ctx, canvas} = this;

            if (!ctx || !canvas || !width || !height) {
                return;
            }

            // 清除画布
            ctx.clearRect(0, 0, width, height);

            // 设置样式
            ctx.fillStyle = fill;
            ctx.strokeStyle = stroke;
            ctx.lineWidth = strokeWidth;

            // 路径内边距，确保描边不会超出边界
            const inset = strokeWidth / 2;

            // 开始绘制路径
            ctx.beginPath();
            this.drawSquirclePath(ctx, borderRadius, width, height, inset);
            ctx.closePath();

            // 填充和描边
            ctx.fill();
            if (strokeWidth > 0) {
                ctx.stroke();
            }
        },

        /**
         * 生成拟圆角矩形的Canvas路径
         * @param {CanvasRenderingContext2D} ctx - Canvas 2D 上下文
         * @param {number} radius - 圆角半径
         * @param {number} width - 矩形宽度
         * @param {number} height - 矩形高度
         * @param {number} inset - 矩形内边距
         */
        drawSquirclePath(ctx, radius, width, height, inset = 0) {
            const k = 1.2819426;
            radius = Math.min(radius * k, width / 2, height / 2);

            const n = [[0.6520, 0.0000], [0.5260, 0.0362], [0.4000, 0.1040], [0.2720, 0.1720], [0.1720, 0.2720], [0.1040, 0.4000], [0.0362, 0.5260], [0.0000, 0.6520], [0.0000, 1.0000]];

            const box = {
                left: inset, right: width - inset, top: inset, bottom: height - inset,
            }
            const edge = {
                top: {start: {x: box.left + radius, y: box.top}, end: {x: box.right - radius, y: box.top}},
                right: {start: {x: box.right, y: box.top + radius}, end: {x: box.right, y: box.bottom - radius}},
                bottom: {start: {x: box.right - radius, y: box.bottom}, end: {x: box.left + radius, y: box.bottom}},
                left: {start: {x: box.left, y: box.bottom - radius}, end: {x: box.left, y: box.top + radius}}
            }
            const corner = {
                topRight: {
                    bezier1: {
                        cp1: {x: box.right - n[0][0] * radius, y: box.top + n[0][1] * radius},
                        cp2: {x: box.right - n[1][0] * radius, y: box.top + n[1][1] * radius},
                        end: {x: box.right - n[2][0] * radius, y: box.top + n[2][1] * radius}
                    }, bezier2: {
                        cp1: {x: box.right - n[3][0] * radius, y: box.top + n[3][1] * radius},
                        cp2: {x: box.right - n[4][0] * radius, y: box.top + n[4][1] * radius},
                        end: {x: box.right - n[5][0] * radius, y: box.top + n[5][1] * radius}
                    }, bezier3: {
                        cp1: {x: box.right - n[6][0] * radius, y: box.top + n[6][1] * radius},
                        cp2: {x: box.right - n[7][0] * radius, y: box.top + n[7][1] * radius},
                        end: {x: box.right - n[8][0] * radius, y: box.top + n[8][1] * radius}
                    }
                }, bottomRight: {
                    bezier1: {
                        cp1: {x: box.right - n[0][1] * radius, y: box.bottom - n[0][0] * radius},
                        cp2: {x: box.right - n[1][1] * radius, y: box.bottom - n[1][0] * radius},
                        end: {x: box.right - n[2][1] * radius, y: box.bottom - n[2][0] * radius}
                    }, bezier2: {
                        cp1: {x: box.right - n[3][1] * radius, y: box.bottom - n[3][0] * radius},
                        cp2: {x: box.right - n[4][1] * radius, y: box.bottom - n[4][0] * radius},
                        end: {x: box.right - n[5][1] * radius, y: box.bottom - n[5][0] * radius}
                    }, bezier3: {
                        cp1: {x: box.right - n[6][1] * radius, y: box.bottom - n[6][0] * radius},
                        cp2: {x: box.right - n[7][1] * radius, y: box.bottom - n[7][0] * radius},
                        end: {x: box.right - n[8][1] * radius, y: box.bottom - n[8][0] * radius}
                    }
                }, bottomLeft: {
                    bezier1: {
                        cp1: {x: box.left + n[0][0] * radius, y: box.bottom - n[0][1] * radius},
                        cp2: {x: box.left + n[1][0] * radius, y: box.bottom - n[1][1] * radius},
                        end: {x: box.left + n[2][0] * radius, y: box.bottom - n[2][1] * radius}
                    }, bezier2: {
                        cp1: {x: box.left + n[3][0] * radius, y: box.bottom - n[3][1] * radius},
                        cp2: {x: box.left + n[4][0] * radius, y: box.bottom - n[4][1] * radius},
                        end: {x: box.left + n[5][0] * radius, y: box.bottom - n[5][1] * radius}
                    }, bezier3: {
                        cp1: {x: box.left + n[6][0] * radius, y: box.bottom - n[6][1] * radius},
                        cp2: {x: box.left + n[7][0] * radius, y: box.bottom - n[7][1] * radius},
                        end: {x: box.left + n[8][0] * radius, y: box.bottom - n[8][1] * radius}
                    }
                }, topLeft: {
                    bezier1: {
                        cp1: {x: box.left + n[0][1] * radius, y: box.top + n[0][0] * radius},
                        cp2: {x: box.left + n[1][1] * radius, y: box.top + n[1][0] * radius},
                        end: {x: box.left + n[2][1] * radius, y: box.top + n[2][0] * radius}
                    }, bezier2: {
                        cp1: {x: box.left + n[3][1] * radius, y: box.top + n[3][0] * radius},
                        cp2: {x: box.left + n[4][1] * radius, y: box.top + n[4][0] * radius},
                        end: {x: box.left + n[5][1] * radius, y: box.top + n[5][0] * radius}
                    }, bezier3: {
                        cp1: {x: box.left + n[6][1] * radius, y: box.top + n[6][0] * radius},
                        cp2: {x: box.left + n[7][1] * radius, y: box.top + n[7][0] * radius},
                        end: {x: box.left + n[8][1] * radius, y: box.top + n[8][0] * radius}
                    }
                }
            };

            // --- 绘制路径 ---
            // 顶边
            ctx.moveTo(edge.top.start.x, edge.top.start.y);
            ctx.lineTo(edge.top.end.x, edge.top.end.y);
            // 右上角
            ctx.bezierCurveTo(corner.topRight.bezier1.cp1.x, corner.topRight.bezier1.cp1.y, corner.topRight.bezier1.cp2.x, corner.topRight.bezier1.cp2.y, corner.topRight.bezier1.end.x, corner.topRight.bezier1.end.y);
            ctx.bezierCurveTo(corner.topRight.bezier2.cp1.x, corner.topRight.bezier2.cp1.y, corner.topRight.bezier2.cp2.x, corner.topRight.bezier2.cp2.y, corner.topRight.bezier2.end.x, corner.topRight.bezier2.end.y);
            ctx.bezierCurveTo(corner.topRight.bezier3.cp1.x, corner.topRight.bezier3.cp1.y, corner.topRight.bezier3.cp2.x, corner.topRight.bezier3.cp2.y, corner.topRight.bezier3.end.x, corner.topRight.bezier3.end.y);
            // 右边
            ctx.lineTo(edge.right.end.x, edge.right.end.y);
            // 右下角
            ctx.bezierCurveTo(corner.bottomRight.bezier1.cp1.x, corner.bottomRight.bezier1.cp1.y, corner.bottomRight.bezier1.cp2.x, corner.bottomRight.bezier1.cp2.y, corner.bottomRight.bezier1.end.x, corner.bottomRight.bezier1.end.y);
            ctx.bezierCurveTo(corner.bottomRight.bezier2.cp1.x, corner.bottomRight.bezier2.cp1.y, corner.bottomRight.bezier2.cp2.x, corner.bottomRight.bezier2.cp2.y, corner.bottomRight.bezier2.end.x, corner.bottomRight.bezier2.end.y);
            ctx.bezierCurveTo(corner.bottomRight.bezier3.cp1.x, corner.bottomRight.bezier3.cp1.y, corner.bottomRight.bezier3.cp2.x, corner.bottomRight.bezier3.cp2.y, corner.bottomRight.bezier3.end.x, corner.bottomRight.bezier3.end.y);
            // 底边
            ctx.lineTo(edge.bottom.end.x, edge.bottom.end.y);
            // 左下角
            ctx.bezierCurveTo(corner.bottomLeft.bezier1.cp1.x, corner.bottomLeft.bezier1.cp1.y, corner.bottomLeft.bezier1.cp2.x, corner.bottomLeft.bezier1.cp2.y, corner.bottomLeft.bezier1.end.x, corner.bottomLeft.bezier1.end.y);
            ctx.bezierCurveTo(corner.bottomLeft.bezier2.cp1.x, corner.bottomLeft.bezier2.cp1.y, corner.bottomLeft.bezier2.cp2.x, corner.bottomLeft.bezier2.cp2.y, corner.bottomLeft.bezier2.end.x, corner.bottomLeft.bezier2.end.y);
            ctx.bezierCurveTo(corner.bottomLeft.bezier3.cp1.x, corner.bottomLeft.bezier3.cp1.y, corner.bottomLeft.bezier3.cp2.x, corner.bottomLeft.bezier3.cp2.y, corner.bottomLeft.bezier3.end.x, corner.bottomLeft.bezier3.end.y);
            // 左边
            ctx.lineTo(edge.left.end.x, edge.left.end.y);
            // 左上角
            ctx.bezierCurveTo(corner.topLeft.bezier1.cp1.x, corner.topLeft.bezier1.cp1.y, corner.topLeft.bezier1.cp2.x, corner.topLeft.bezier1.cp2.y, corner.topLeft.bezier1.end.x, corner.topLeft.bezier1.end.y);
            ctx.bezierCurveTo(corner.topLeft.bezier2.cp1.x, corner.topLeft.bezier2.cp1.y, corner.topLeft.bezier2.cp2.x, corner.topLeft.bezier2.cp2.y, corner.topLeft.bezier2.end.x, corner.topLeft.bezier2.end.y);
            ctx.bezierCurveTo(corner.topLeft.bezier3.cp1.x, corner.topLeft.bezier3.cp1.y, corner.topLeft.bezier3.cp2.x, corner.topLeft.bezier3.cp2.y, corner.topLeft.bezier3.end.x, corner.topLeft.bezier3.end.y);
        }
    },

    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行
     */
    lifetimes: {
        ready() {
            this.initCanvas();
        },
    },

    /**
     * 监听属性变化，当相关属性更新时重新绘制
     */
    observers: {
        'borderRadius, fill, stroke, strokeWidth, width, height': function () {
            // 确保 ctx 已经初始化
            if (this.ctx) {
                this.draw();
            }
        }
    }
});
