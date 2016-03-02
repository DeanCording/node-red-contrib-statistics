# Node Red Statistics

Calculates statistics about input data. This is a wrapper around the [Simple Statistics](http://simplestatistics.org) Node library.

## Inputs

Normally, the value of msg.payload is saved into the data set. When a message with a topic that ends in a statistical function name is received, that statistic is calculated and output as the msg.payload. For example, a message with the topic `data/mean` would output the mean of the data received so far. Optionally, the function name can be stripped from the topic. For statistical functions that require a parameter, the parameter is passed in using msg.payload.

## Functions

The functions in the Simple Statistics library that are supported are:

- bernoulliDistribution
- chunk
- ckmeans
- cumulativeStdNormalProbability
- errorFunction
- factorial
- inverseErrorFunction
- geometricMean
- harmonicMean
- interquartileRange
- linearRegression
- mad
- max
- mean
- median
- min
- mode
- poissonDistribution
- probit
- quantile
- rootMeanSquare
- sample
- sampleSkewness
- sampleStandardDeviation
- standardDeviation
- sum
- sumNthPowerDeviations
- tTest
- uniqueCount
- variance

In addition, two other functions are implemented:

- size - returns the size of the data set
- clear - clears the data set

For more detailed information about the functions see the [Simple Statistics API documentation](http://http://simplestatistics.org/docs/).


