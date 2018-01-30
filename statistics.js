/**
 * Copyright 2018 Dean Cording
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
    var util = require('util');


    function StatisticsNode(config) {
        RED.nodes.createNode(this,config);

        var node = this;

        node.dataSetSize = ((config.dataSetSize != undefined) ? config.dataSetSize : 0) * 1;
        node.stripFunction = (config.stripFunction != undefined) ? config.stripFunction : true;
        node.inputField = config.inputField || "payload";
        node.inputFieldType = config.inputFieldType || "msg";
        node.resultField = config.resultField || "payload";
        node.resultFieldType = config.resultFieldType || "msg";
        node.parameterField = config.parameterField || "";
        node.parameterFieldType = config.parameterFieldType || "msg";
        node.resultOnly = (config.resultOnly != undefined) ? config.resultOnly : true;

        node.data= [];

        if (node.dataSetSize < 0) node.dataSetSize = 0;

        var setNodeProperty = function(field, type, node, msg, value) {
            if (type === 'msg') {
                RED.util.setMessageProperty(msg,field,value);
            } else if (type === 'flow') {
                node.context().flow.set(field,value);
            } else if (type === 'global') {
                node.context().global.set(field,value);
            }
        };


        var saveData = function(value) {
            if (value != undefined) {
                if (Array.isArray(value)) {
                    value.forEach(function (element) {
                        saveData(element);
                    });
                } else {
                    value = parseFloat(value);
                    if (!isNaN(value)) {
                        node.data.push(value);

                        if (node.dataSetSize > 0) {
                            while (node.data.length > node.dataSetSize) {
                                node.data.shift();
                            }
                        }
                    }
                }
            }
        };


        this.on('input', function(msg) {

            var funcIndex = msg.topic.lastIndexOf('/');

            var func = msg.topic.slice(funcIndex+1);

            if (node.stripFunction && (funcIndex != -1)) {
                msg.topic = msg.topic.substring(0,funcIndex);
            }

            var value = RED.util.evaluateNodeProperty(node.inputField, node.inputFieldType, node, msg);

            var result;
            var parameter;

            switch (func) {
                case 'clear':
                    node.data =[];
                    saveData(value);
                    if (node.resultsOnly) {
                        return null;
                    }
                    break;

                case 'dump':
                    saveData(value);
                    result = Array.from(node.data);
                    break;

                case 'size':
                case 'count':
                    saveData(value);
                    result = node.data.length;
                    break;

                case 'bernoulliDistribution':
                case 'cumulativeStdNormalProbability':
                case 'errorFunction':
                case 'factorial':
                case 'inverseErrorFunction':
                case 'poissonDistribution':
                case 'probit':
                    parameter = parseFloat(RED.util.evaluateNodeProperty(node.parameterField,
                                                      node.parameterFieldType, node, msg));
                    if (isNaN(parameter)) {
                        node.warn("Non-numeric data received: " + parameter);
                        return null;
                    } else {
                        result = statistics[func](parameter);
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
                case 'sampleKurtosis':
                case 'sampleSkewness':
                case 'sampleStandardDeviation':
                case 'standardDeviation':
                case 'sum':
                case 'variance':

                    saveData(value);
                    result = statistics[func](node.data);
                    break;

                case 'uniqueCountSorted':
                case 'uniqueCount':

                    saveData(value);
                    result = statistics.uniqueCountSorted(node.data.sort(function(a, b){return a>b;}));
                    break;

                case 'chunk':
                case 'ckmeans':
                case 'quantile':
                case 'sample':
                case 'sumNthPowerDeviations':
                case 'tTest':

                    if (node.parameterField != node.inputField ||
                            node.parameterFieldType != node.inputFieldType ) {
                        saveData(value);
                    }

                    parameter = parseFloat(RED.util.evaluateNodeProperty(node.parameterField,
                                                      node.parameterFieldType, node, msg));
                    if (isNaN(parameter)) {
                        node.warn("Non-numeric data received: " + parameter);
                        return null;
                    } else {
                        result = statistics[func](node.data,parameter);
                    }
                    break;

                default:
                    saveData(value);
                    if (node.resultOnly) {
                        return null;
                    }
            }

            if (result != undefined) {
                setNodeProperty(node.resultField, node.resultFieldType, node, msg, result);
            }

            node.send(msg);
        });
    }
    RED.nodes.registerType("statistics",StatisticsNode);
};
