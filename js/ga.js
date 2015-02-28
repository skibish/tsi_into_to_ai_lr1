function GA ()
{
    /**
     * Minimum X
     * @type {number}
     */
    this.xMin = 0;

    /**
     * Maximum X
     * @type {number}
     */
    this.xMax = 0;

    /**
     * Length of X
     * @type {number}
     */
    this.xLength = 0;

    /**
     * Collection of X chromosomes
     * @type {Array}
     */
    this.xArray = [];

    /**
     * Minimum Y
     * @type {number}
     */
    this.yMin = 0;

    /**
     * Maximum Y
     * @type {number}
     */
    this.yMax = 0;

    /**
     * Length of Y
     * @type {number}
     */
    this.yLength = 0;

    /**
     * Collection of Y chromosomes
     * @type {Array}
     */
    this.yArray = [];

    /**
     * Population
     * @type {number}
     */
    this.population = 0;

    /**
     * Collection
     * @type {Array}
     */
    this.collection = [];

    /**
     * New population
     * @type {Array}
     */
    this.newPopulation = [];

    /**
     * Maximum fitness
     * @type {number}
     */
    this.maximum = 0;

    /**
     * Best chromosomes
     * @type {Array}
     */
    this.bestOfChromosomes = [];

    /**
     * Accuracy
     * @type {number}
     */
    this.accuracy = 0;

    /**
     * Crossing frequency
     * @type {number}
     */
    this.crossingFrequency = 0;

    /**
     * Mutation frequency
     * @type {number}
     */
    this.mutationFrequency = 0;

    /**
     * Defined function
     * @param x
     * @param y
     * @returns {number}
     */
    var definedFunction = function(x, y) {
        return Math.pow(x, 2) + Math.pow(y, 2) + x * y * Math.sin(x + y);
    };

    /**
     * Fitness function
     * @param x
     * @param y
     * @returns {number}
     */
    this.fitness = function(x, y) {
        return 1 / definedFunction(x, y);
    };

    /**
     * Get length of binary for given range
     * @param what
     * @returns {int|string}
     */
    this.getBinLengthFor = function(what) {
        switch (what) {
            case 'X':
                what = (this.xMax - this.xMin) / this.accuracy;
                break;
            case 'Y':
                what = (this.yMax - this.yMin) / this.accuracy;
                break;
            default:
                return 'NO SUCH AXES';
        }

        var power = 1;
        while(Math.pow(2, power) < what) {
            power++;
        }

        return power;
    };

    /**
     * Build allele for X
     */
    this.buildGenesForX = function() {
        for (var i = 0; i < this.population; i++) {
            var bin = (Math.floor(Math.random() * (this.xMax - this.xMin))).toString(2);
            while(bin.length < this.xLength) {
                bin = '0' + bin;
            }
            this.xArray.push(bin);
        }
    };

    /**
     * Build allele for Y
     */
    this.buildGenesForY = function() {
        for (var i = 0; i < this.population; i++) {
            var bin = (Math.floor(Math.random() * (this.yMax - this.yMin))).toString(2);
            while(bin.length < this.yLength) {
                bin = '0' + bin;
            }
            this.yArray.push(bin);
        }
    };

    /**
     * Join alleles of X and Y in chromosomes
     */
    this.joinChromosomes = function() {
        for (var i = 0; i < this.population; i++) {
            this.collection.push(this.xArray[i] + this.yArray[i]);
        }
    };

    /**
     * Get X value from chromosome
     * @param chromosome
     * @returns {Number}
     */
    this.getX = function(chromosome) {
        return parseInt(chromosome.substring(0, this.xLength), 2);
    };

    /**
     * Get Y value from chromosome
     * @param chromosome
     * @returns {Number}
     */
    this.getY = function(chromosome) {
        return parseInt(chromosome.substring(this.yLength + 2), 2);
    };

    /**
     * Selection
     */
    this.selection = function() {

        // Find all fitness values and their sum
        var fitnessValues = []; var sum = 0; var value = 0; var bestChromosome = '';
        for (var i = 0; i < this.collection.length; i++) {
            value = this.fitness(this.getX(this.collection[i]), this.getY(this.collection[i]));

            // Save max value of fitness
            if (value > this.maximum) {
                this.maximum = value;
                bestChromosome = this.collection[i];
            }

            fitnessValues.push(value);
            sum += value;
        }

        this.bestOfChromosomes.push(bestChromosome);

        // Find all relative values
        var relativeFitness = [];
        for (var i = 0; i < fitnessValues.length; i++) {
            relativeFitness.push( fitnessValues[i] / sum );
        }

        // Generate N random numbers from 0 to 1
        var rnd = [];
        for (var i = 0; i < this.population; i++) {
            rnd.push(Math.random());
        }

        // Find all winners
        var leftMargin = 0; var rightMargin = 0;
        for (var i = 0; i < relativeFitness.length; i++) {
            rightMargin += relativeFitness[i];

            for (var j = 0; j < rnd.length; j++) {
                if ( rnd[j] >= leftMargin && rnd[j] < rightMargin) {
                    this.newPopulation.push(this.collection[i]);
                }
            }

            leftMargin = rightMargin;
        }
    };

    /**
     * Crossing of chromosomes with with random range
     */
    this.crossing = function() {
        var population = this.newPopulation;
        var toCross = [];

        // Generate random indexes of chromosomes to cross
        for (var i = 0; i < population.length; i++) {
            if (Math.random() < this.crossingFrequency) {
                toCross.push(i);
            }
        }

        // While there is something to cross do
        while (toCross.length > 1) {
            var firstIndex = Math.floor(Math.random() * toCross.length);
            var firstChromosome = population[toCross[firstIndex]];
            toCross.splice(0, firstIndex);

            var secondIndex = Math.floor(Math.random() * toCross.length);
            var secondChromosome = population[toCross[secondIndex]];
            toCross.splice(0, secondIndex);

            // Select random range and cross
            var rIndex = Math.floor(Math.random() * firstChromosome.length);
            var lIndex = Math.floor(Math.random() * rIndex);
            var partOfFirst = firstChromosome.substring(lIndex, rIndex);
            this.newPopulation[firstIndex] = this.replaceRange(firstChromosome, lIndex, rIndex, secondChromosome.substring(lIndex, rIndex));
            this.newPopulation[secondIndex] = secondChromosome.replace(secondChromosome.substring(lIndex, rIndex), partOfFirst);
        }
    };

    /**
     * Replace character in string
     * @param string
     * @param index
     * @param character
     * @returns {string}
     */
    this.replaceAt = function(string, index, character) {
        return string.substr(0, index) + character + string.substr(index+character.length);
    };

    /**
     * @link http://stackoverflow.com/questions/12568097/how-can-i-replace-a-string-by-range
     * @param s
     * @param start
     * @param end
     * @param substitute
     * @returns {string}
     */
    this.replaceRange = function(s, start, end, substitute) {
        return s.substring(0, start) + substitute + s.substring(end);
    };

    /**
     * Mutation on one point
     */
    this.mutation = function () {

        // For each chromosome in new population
        for (var i = 0; i < this.newPopulation.length; i++) {
            // Extract binary number and loop through
            for (var j = 0; j < this.newPopulation[i].length; j++) {
                // Find, which one to mutate
                if (Math.random() < this.mutationFrequency) {
                    // Mutate
                    if (this.newPopulation[i].substr(j, 1) == '0') {
                        this.newPopulation[i] = this.replaceAt(this.newPopulation[i], j, '1');
                    } else {
                        this.newPopulation[i] = this.replaceAt(this.newPopulation[i], j, '0');
                    }
                }
            }
        }
    };

    /**
     * Initialize all variables
     */
    this.init = function() {
        this.xMax = $('input[name=x-max]').val(); this.xMin = $('input[name=x-min]').val();
        this.yMax = $('input[name=y-max]').val(); this.yMin = $('input[name=y-min]').val();
        this.population = $('input[name=population]').val(); this.accuracy = $('input[name=accuracy]').val();
        this.crossingFrequency = $('input[name=cross]').val(); this.mutationFrequency = $('input[name=mutation]').val();
        this.xLength = this.getBinLengthFor('X'); this.yLength = this.getBinLengthFor('Y');

        this.buildGenesForX(); this.buildGenesForY(); this.joinChromosomes();
    };

    this.dataPoints = [];
    this.convergence = [];

    /**
     * Run genetic algorithm
     */
    this.run = function () {
        var prevMax = 100; var generation = 0;
        var shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'];
        while (Math.abs(prevMax - this.maximum) > this.accuracy) {
            this.convergence.push(Math.abs(prevMax - this.maximum));
            this.dataPoints.push({
                key: 'Generation ' + generation,
                values: []
            });

            for(var i = 0; i < this.collection.length; i++) {
                this.dataPoints[generation].values.push({
                    x: this.getX(this.collection[i]),
                    y: this.getY(this.collection[i]),
                    size: Math.round(Math.random() * 100) / 100,
                    shape: shapes[generation]
                });
            }

            prevMax = this.maximum;
            this.maximum = 0;
            this.selection();
            if (! isFinite(this.maximum)) {
                this.maximum = 0;
                break;
            }
            this.crossing();
            this.mutation();

            this.collection = this.newPopulation;
            this.newPopulation = [];
            generation++;
        }

        this.convergence.push(Math.abs(prevMax - this.maximum));
        var theBestValues = this.bestOfChromosomes.pop();

        $('div.panel-footer').text(
            'X: ' + this.getX(theBestValues) + ', Y: ' + this.getX(theBestValues)
        );

    }

}