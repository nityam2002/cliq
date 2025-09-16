import { PromoterRow, PromoterTable } from "@org-quicko/cliq-sheet-core/Program/beans";
import { ConverterException } from "@org-quicko/core";
import { ProgramPromoter } from "../../entities";
import { promoterStatusEnum } from "../../enums";

export interface PromoterAggregatedMetrics {
        promoterId: string;
        promoterName: string;
        status: promoterStatusEnum;
        signUps: number;
        purchases: number;
        revenue: number;
        commissionOnSignUps: number;
        commissionOnPurchases: number;
}

export class PromoterTableConverter {
        convertFrom(
                programPromoters: ProgramPromoter[],
                promoterMetricsMap: Map<string, PromoterAggregatedMetrics>,
        ) {
                try {
                        const promoterTable = new PromoterTable();
                        programPromoters.forEach((programPromoter) => {
                                const promoter = programPromoter.promoter;

                                if (!promoter) {
                                        return;
                                }

                                const metrics = promoterMetricsMap.get(promoter.promoterId) ?? {
                                        promoterId: promoter.promoterId,
                                        promoterName: promoter.name,
                                        status: promoter.status,
                                        signUps: 0,
                                        purchases: 0,
                                        revenue: 0,
                                        commissionOnSignUps: 0,
                                        commissionOnPurchases: 0,
                                };

                                const row = new PromoterRow([]);
                                row.setPromoterId(metrics.promoterId);
                                row.setPromoterName(metrics.promoterName);
                                row.setStatus(metrics.status);
                                row.setSignups(metrics.signUps);
                                row.setCommissionOnSignups(metrics.commissionOnSignUps);
                                row.setPurchases(metrics.purchases);
                                row.setCommissionOnPurchases(metrics.commissionOnPurchases);
                                row.setRevenue(metrics.revenue);
                                row.setTotalCommission(metrics.commissionOnSignUps + metrics.commissionOnPurchases);

                                promoterTable.addRow(row);
                        });

                        return promoterTable;
                } catch (error) {
                        throw new ConverterException('Error in PromoterTableConverter.convertFrom', error);
                }
        }
}