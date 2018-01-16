# Node Red Statistics

Calculates statistics about input data. This is a wrapper around the [Simple Statistics](http://simplestatistics.org) Node library.

## Inputs

Normally, the value of an input property is saved into the data set. The
`input property` may also contain an array of values which will be saved into the
data set.  If `data set size` is greater that 0 then the size of the data set will be
limited to the number of elements specified, with the oldest elements dropped first.

When a message with a topic that ends in a statistical function name is received, that statistic is calculated and output to the output property. For example, a message with the topic `data/mean` would output the mean of the data received so far. Optionally, the function name can be stripped from the topic. For statistical functions that require a parameter, the parameter is passed in using the parameter property.

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
- medianAbsoluteDeviation
- max
- mean
- median
- min
- mode
- poissonDistribution
- probit
- product
- quantile
- rootMeanSquare
- sample
- smapleKurtosis
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
- dump - dumps the data set in an array

For more detailed information about the functions see the [Simple Statistics API documentation](http://simplestatistics.org/docs/).


