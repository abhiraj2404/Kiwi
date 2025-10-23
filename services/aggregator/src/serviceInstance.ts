import { AggregatorService } from "./aggregator.service";

// Create a single shared instance of AggregatorService
// This instance is used by both the aggregator service itself and the API Gateway
export const aggregator = new AggregatorService();
