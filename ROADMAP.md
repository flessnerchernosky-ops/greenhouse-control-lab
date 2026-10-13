# 研究路线 / Research roadmap

## 已实现 / Implemented

四种控制方法、五种场景、延迟与参数设置、完整 CSV、中英 UI、15 项模型检查、15 组配置 / 60 条轨迹指标、Python 独立热模型回放和指标审核。

Four controllers, five scenes, delay/parameter controls, complete CSV, bilingual UI, 15 model checks, 15 configurations / 60 trajectory metrics, independent Python plant replay and metric audit.

## 第一项个人实验 / First personal experiment

**问题 / Question:** 纠正更急是否总能让温度更稳？ / Does stronger correction always improve regulation?

保持冷空气场景、6 s 延迟、100% 功率、Ki = 0.008、正确散热估计；Kp 取 0.08、0.16、0.24、0.32、0.40。每种方法用相同预算；报告全程/末段 MAE 和加热用量。预先写下假设，完成全部设置，保留退化结果。将调参天气和新的评估天气分开，不在看到成绩后挑选有利场景。

Keep cold-front conditions, 6 s delay, 100% power, Ki = 0.008 and correct heat-loss estimate. Sweep Kp over 0.08, 0.16, 0.24, 0.32, 0.40 using equal budgets for each method. Report full/final-window MAE and heater usage. Predefine a hypothesis, complete every setting and retain regressions. Separate tuning weather from new evaluation weather.

## 后续阶段，尚未实现 / Future work, not implemented

1. 独立参数网格和误差—用量 Pareto 图。 / Separate parameter grids and error–usage Pareto plots.
2. 加入实际额定功率、分时电价，再区分节能和节费。 / Add a heater rating and time-of-use tariff; distinguish energy from cost.
3. 种子固定的测量噪声，多次随机重复和误差分布。 / Seeded measurement noise, repeated random trials and error distributions.
4. 基于两个热节点的模型与状态估计；模型辨识使用独立训练/评估数据。 / Two-node thermal dynamics, state estimation and identification with separate training/evaluation records.
5. 约束 MPC 对照；相同模型、执行器限制、调参预算和评估集。 / Constrained MPC with matched plant, limits, tuning budget and evaluation set.

这些不是当前功能或已取得的研究成果。申请展示应明确 AI 辅助部分及你的实验设计、代码改动、失败分析和可复现记录。

These are proposed extensions, not current features or research findings. Describe AI assistance and your own design, code changes, failure analysis and reproducible records.
