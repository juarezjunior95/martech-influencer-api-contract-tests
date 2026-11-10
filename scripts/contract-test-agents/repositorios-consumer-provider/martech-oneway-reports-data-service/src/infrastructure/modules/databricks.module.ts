import { Module } from "@nestjs/common";
import { DatabricksClient } from "../services/databricks.client";
import { CommonModule } from "@common/common.module";

/**
 * Databricks Module
 * Handles Databricks connections and operations
 */
@Module({
  imports: [CommonModule],
  providers: [
    {
      provide: "DatabricksClient",
      useClass: DatabricksClient,
    },
  ],
  exports: ["DatabricksClient"],
})
export class DatabricksModule {}
