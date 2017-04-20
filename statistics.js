/**
 * Copyright 2016 Dean Cording
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {

    var statistics = require('simple-statistics');


    function StatisticsNode(config) {
        RED.nodes.createNode(this,config);
	this.stripFunction = config.stripFunction;
        var node = this;
        this.on('input', function(msg) {

            var context = this.context();

            var data = context.get('data') || [];
	    var funcIndex = msg.topic.lastIndexOf('/');
            var func = msg.topic.slice(funcIndex+1);

	    if (node.stripFunction && (funcIndex != -1)) {
		msg.topic = msg.topic.substring(0,funcIndex);
	    }

            switch (func) {
		case 'clear':
		    context.set('data', []);
		    return null;

		case 'size':
		    msg.payload = data.length;
		    break;

		case 'bernoulliDistribution':
		case 'cumulativeStdNormalProbability':
		case 'errorFunction':
		case 'factorial':
		case 'inverseErrorFunction':
		case 'poissonDistribution':
		case 'probit':

                    var value = parseFloat(msg.payload);
                    if (isNaN(value)) {
                        node.warn("Non-numeric data received: " + msg.payload);
			return null;
                    } else {
			msg.payload = statistics[func](value);
                    }
		    break;


                case 'geometricMean':
                case 'harmonicMean':
                case 'interquartileRange':
		case 'medianAbsoluteDeviation':
		case 'max':
                case 'mean':
		case 'median':
		case 'min':
		case 'mode':
                case 'product':
		case 'rootMeanSquare':
		case 'sampleSkewness':
		case 'sampleStandardDeviation':
		case 'standardDeviation':
		case 'sum':
		case 'variance':

		    msg.payload = statistics[func](data);
                    break;

		case 'sortedUniqueCount':
		case 'uniqueCount':

		    msg.payload = statistics.sortedUniqueCount(data.sort(function(a, b){return a>b}));
		    break;

		case 'chunk':
		case 'ckmeans':
		case 'quantile':
		case 'sample':
		case 'sumNthPowerDeviations':
		case 'tTest':
                   var value = parseFloat(msg.payload);
                    if (isNaN(value)) {
                        node.warn("Non-numeric data received: " + msg.payload);
                        return null;
                    } else {
                        msg.payload = statistics[func](data,value);
                    }
                    break;


	        default:
		    var value = parseFloat(msg.payload);
            	    if (isNaN(value)) {
                        node.warn("Non-numeric data received: " + msg.payload);
                    } else {
                        data.push(value);
                        context.set('data', data);
		    }
                    // Swallows the message
                    return null;
	    }
            node.send(msg);
        });
    }
    RED.nodes.registerType("statistics",StatisticsNode);
}
