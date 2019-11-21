
class Model{

    static getModel(){
        
        const model = tf.sequential();
        const input = tf.layers.dense({'units': 8, 'inputShape':[8]});
        const dense1 = tf.layers.dense({'units': 8,  "activation": "sigmoid"});
        const dense2 = tf.layers.dense({"units": 4, "activation": "softmax"});
      
        model.add(input);
        model.add(dense1);
        model.add(dense2)

        //change bias values

        var shapes = Model.shapes();

        model.layers[0].setWeights([tf.randomNormal(shapes[0]), tf.randomNormal([shapes[0][1]])]);
        model.layers[1].setWeights([tf.randomNormal(shapes[1]), tf.randomNormal([shapes[1][1]])]);
        model.layers[2].setWeights([tf.randomNormal(shapes[2]), tf.randomNormal([shapes[2][1]])]);
        

        return model;
    } 

    // list of shapes for just the weights for each layer where [row, col]
    static shapes(){
        return [[8,8], [8,8], [8, 4]]
    }

    //give back column of highest prediction
    static predict(model, features){

       var predictionTensor = tf.tensor(features, [1,8]);
       var resultingTensor = model.predict(predictionTensor).arraySync()[0];

       var maxIndex = 0;
       for(var i = 1; i < resultingTensor.length; i++){
           if(resultingTensor[maxIndex] < resultingTensor[i]){
               maxIndex = i;
           }
       }

       return maxIndex;
    }

    //perform mitosis on both models
    static mitosis(m1, m2){

        const performSingleCrossover = (m1_weights, m2_weights, indexOfCross)=>{
            //create a new m1_prime weights
            var m1_prime_weights = m1_weights.slice(0, indexOfCross).concat(m2_weights.slice(indexOfCross));

            
            var m2_prime_weights = m2_weights.slice(0, indexOfCross).concat(m1_weights.slice(indexOfCross));

            return [m1_prime_weights, m2_prime_weights];
        }

        //perform multipoint crossover to weights
        const performMultiPointCrossover = (m1_weights, m2_weights)=>{
            var m1_prime = [];
            var m2_prime= [];
            for(var i =0; i < m1_weights.length; i++){
                if(Math.random() < 0.5){
                    m1_prime.push(m1_weights[i]);
                    m2_prime.push(m2_weights[i]);
                }
                else{
                    m1_prime.push(m2_weights[i]);
                    m2_prime.push(m1_weights[i]);
                }
            }
            return [m1_prime, m2_prime];
        }

        //mutate the weights
        const performMutation = (rate, weights, scale)=>{
            for(var i = 0; i < weights.length; i++){
                if(Math.random() * 1000 < rate){
                    weights[i] = tf.randomNormal([1]).arraySync[0];
                    rate *= 0.6;
                }
                else{
                    weights[i] += tf.randomNormal([1]).arraySync[0]/scale;
                }
            }

            return weights;
        }

        var shape_array = Model.shapes();

        var m1_prime = Model.getModel();
        var m2_prime = Model.getModel();

        for(var i = 0; i < m1.layers.length; i++){
            
            //get the weights into array
            var m1_weights = m1.layers[i].getWeights()[0].flatten().arraySync();
            var m2_weights = m2.layers[i].getWeights()[0].flatten().arraySync();

            //get biases into array
            var m1_bias = m1.layers[i].getWeights()[1].flatten().arraySync();
            var m2_bias = m2.layers[i].getWeights()[1].flatten().arraySync();

            var bothWeights = performMultiPointCrossover(m1_weights, m2_weights);
            bothWeights[0] = performMutation(15, bothWeights[0], 50);
            bothWeights[1] = performMutation(15, bothWeights[1], 50);
            
            var bothBiases = performMultiPointCrossover(m1_bias, m2_bias);

            bothBiases[0] = performMutation(25, bothBiases[0], 50);
            bothBiases[1] = performMutation(25, bothBiases[1], 50);

            //set the weights to the modeol and return
            m1_prime.layers[i].setWeights([tf.tensor(bothWeights[0], shape_array[i]), tf.tensor(bothBiases[0])]);
            m2_prime.layers[i].setWeights([tf.tensor(bothWeights[1], shape_array[i]), tf.tensor(bothBiases[1])]);
        }

        return [m1, m2];

    }
}

export default Model;