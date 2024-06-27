class Graph
{
    constructor(canvas)
    {
        this.algorithm = canvas.algorithm_name;
        this.w = canvas.width;
        this.h = canvas.height;
        this.ctx = canvas.ctx;
        this.opInterval = canvas.opInterval;

        this.bars = [];
        this.bar_width = 0;

        this.currentGroup = {x: 0, width: 0};
        // this.currentPivotIndex = 0;
        // this.workArrayIndex = 0;
    }

    populateBars(amount)
    {
        if(this.bars.length > 0) this.bars.splice(0, this.bars.length);

        const expected_amount = Math.abs(amount);
        const min_bar_width = 5;
        const final_bar_width = this.w/expected_amount > min_bar_width ? this.w/expected_amount : min_bar_width; // bar graphic width value
        const final_amount = final_bar_width * expected_amount <= this.w ? expected_amount : Math.floor(this.w/final_bar_width); // Actual amount of bars
        this.bar_width = final_bar_width;

        if(final_amount != amount) console.log("A quantidade inserida ultrapassa os limites estabelecidos. A quantidade corrigida é de " + final_amount + " barras.");

        const colors = new Uint8ClampedArray(3);
        colors[0] = 0;
        colors[1] = 50;
        colors[2] = 255;

        var bar_value = 0;
        var color = "rgb(30, 30, 30)";

        const test_array =
        [80, 30, 14, 16, 9, 31, 20, 12, 23, 100, 125, 240, 255, 240, 206, 204, 250, 147, 13, 19];

        const bars = Array.from( {length: final_amount}, (_, index) =>
        {
            bar_value = test_array[index];
            bar_value = Math.floor(Math.random()*this.h);
            color = `rgb(${bar_value}, ${colors[1]}, ${colors[2] - bar_value})`;
            return new Bar(bar_value > 10 ? bar_value : bar_value+10, final_bar_width, color, this.ctx, this.h, index);
        });

        this.bars.push(...bars);

        // console.log(this.bars);
    }

    updateBlock(a, b)
    {
        this.currentGroup.x = a*this.bar_width;
        this.currentGroup.width = (b-a+1)*this.bar_width;
    }


    swap(a, b)
    {
        return new Promise((resolve) =>
        {
            console.log("\tTrocando " + this.bars[b].value + " de posição com " + this.bars[a].value);
            [this.bars[a], this.bars[b]] = [this.bars[b], this.bars[a]]
            
            // console.log(Array.from(this.bars).map(x => x.value));
            this.updateBarsPos(a, b);

            setTimeout(resolve, this.opInterval);
        });
    }
    
    updateBarsPos(a, b)
    {
        // console.log("Updating bars["+a+"]" + "/ Updating bars["+b+"]\n");
        this.bars[a].updatePos(a);
        this.bars[b].updatePos(b);
    }
    

    update()
    {
        // console.log("Atualizando estado do gráfico.");
        this.moveBars();
        // Mais alguma coisa por aqui, talvez...
    }
    
    moveBars(){ for(let bar of this.bars) bar.move(); }

    drawBars()
    {
        this.ctx.clearRect(0, 0, this.w, this.h);

        this.ctx.fillStyle = "rgba(0, 200, 50, .2)";
        this.ctx.fillRect(this.currentGroup.x, 0, this.currentGroup.width, this.h);
        // this.ctx.fillRect(0, 0, this.currentWorkingGroupPos.left*this.bar_width, this.currentWorkingGroupPos.right*this.bar_width);
        // this.ctx.fillRect(this.currentWorkingGroupPos.left, );

        for(let bar of this.bars) bar.draw();
    }
}