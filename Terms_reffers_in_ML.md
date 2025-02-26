

## Key Terms using in ML

ML pipelines involve a series of steps to automate the machine learning workflow, from data preparation to model deployment. Here are some of the key terms you'll encounter:

**Data Ingestion & Preparation**:

    Data Source: The origin of the raw data (e.g., databases, files, APIs).
    Data Extraction: The process of retrieving data from the source.
    Data Transformation: Cleaning, filtering, and modifying data to prepare it for modeling. This includes:
    Data Cleaning: Handling missing values, outliers, and inconsistencies.
    Feature Engineering: Creating new features from existing ones.
    Feature Scaling/Normalization: Adjusting the range of feature values.
    Data Validation: Ensuring data quality and consistency.
    Data Splitting: Dividing the dataset into training, validation, and test sets.
    Feature Store: A centralized repository for storing and managing features.
    Hyperparameter: They are configuration variables that are set before the learning process begins, and they influence how the model learns.
**Model Training & Evaluation**:

    Model Training: The process of fitting a machine learning model to the training data.
    Hyperparameter Tuning: Optimizing the model's parameters to improve performance.
    Model Evaluation: Assessing the model's performance using metrics like accuracy, precision, recall, and F1-score.
    Cross-Validation: A technique for evaluating model performance by splitting the data into multiple folds.
    Model Serialization: Saving the trained model in a format that can be deployed.
    Model Registry: A centralized repository for storing and managing trained models.
**Model Deployment & Monitoring**:

    Model Deployment: Making the trained model available for predictions in a production environment.
    Inference: The process of using the deployed model to make predictions.
    Online Inference: Real-time predictions.
    Batch Inference: Predictions made on a batch of data.
    Model Serving: The infrastructure that hosts and serves the deployed model.
    Monitoring: Tracking the model's performance and behavior in production.
    Data Drift: Changes in the distribution of input data.
    Concept Drift: Changes in the relationship between input data and target variable.
    Model Drift: Degradation in model performance over time.
    Retraining: Updating the model with new data to maintain performance.
    A/B Testing: Comparing the performance of different models in production.
**Pipeline Concepts**:

    Pipeline Orchestration: Managing the execution of the different steps in the ML pipeline.
    Workflow Automation: Automating the entire ML pipeline.
    CI/CD (Continuous Integration/Continuous Delivery): Implementing practices for automatically building, testing, and deploying ML models.
    MLOps (Machine Learning Operations): The practice of applying DevOps principles to machine learning.
    Artifact Tracking: Keeping track of all the artifacts generated during the ML pipeline, such as datasets, models, and metrics.
    Metadata Management: Storing and managing metadata about the data, models, and pipeline.
    Directed Acyclic Graph (DAG): Often used to represent the flow of steps in an ML pipeline.
    Containerization: Packaging the model and its dependencies into a container for easy deployment.
    Orchestrator: A tool or platform that manages the execution of the ML pipeline (e.g., Airflow, Kubeflow).