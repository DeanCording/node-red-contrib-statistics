# Node Red Statistics

Calculates statistics about input data. This is a wrapper around the [Simple Statistics](http://simplestatistics.org) Node library.

## Inputs

Normally, the value of an input property is saved into the data set. The
`input property` may also contain an array of values which will be saved into the
data set.  If `data set size` is greater that 0 then the size of the data set will be
limited to the number of elements specified, with the oldest elements dropped first.

When a message is received with a [MQTT format](http://public.dhe.ibm.com/software/dw/webservices/ws-mqtt/mqtt-v3r1.html#appendix-a) topic that ends with a sub-topic that is a statistical function name, that statistic is calculated and output to the output property. For example, a message with the topic `data/mean` would output the mean of the data received so far. Optionally, the function name can be stripped from the topic. For statistical functions that require a parameter, the parameter is passed in using the parameter property.

## Functions

The functions in the Simple Statistics library that are supported are:

- bernoulliDistribution
- chunk
- ckmeans
- cumulativeStdNormalProbability
- equalIntervalBreaks
- errorFunction
- extent
- factorial
- inverseErrorFunction
- gamma
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
- quantileRank
- rootMeanSquare
- sample
- sampleWithReplacement
- sampleKurtosis
- sampleSkewness
- sampleStandardDeviation
- shuffle
- standardDeviation
- sum
- sumNthPowerDeviations
- tTest
- uniqueCount
- variance

In addition, three other functions are implemented:

- size - returns the size of the data set
- clear - clears the data set
- dump - dumps the data set in an array

These three functions can also contain a data item or array of data items which are added to the data set before calculating the result for `size` or `dump`, or after the data set is cleared for `clear`.

For more detailed information about the functions see the [Simple Statistics API documentation](http://simplestatistics.org/docs/).


