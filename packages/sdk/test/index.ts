import createLogger from "@zerodao/logger"
import { FIXTURES } from "@zerodao/constants"

const tests = () => {
    const logger = createLogger();
    logger.info("test suite working with logging");
    logger.info(FIXTURES.MATIC);
}

tests();
