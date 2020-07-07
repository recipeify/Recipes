from diagrams import Cluster, Diagram, Edge
from diagrams.aws.compute import EB, ECR, Lambda
from diagrams.aws.analytics import ES
from diagrams.aws.network import ELB
from diagrams.onprem.database import MongoDB
from diagrams.onprem.vcs import Github
from diagrams.saas.identity import Auth0
from diagrams.saas.cdn import Cloudflare
from diagrams.saas.recommendation import Recombee


with Diagram("Recipeify Architecture"):

    with Cluster("Github"):
        ci = Github("Actions CI/CD")
        Github("Open Source Repo") >> ci



    with Cluster("Cloudfare"):
        clf = Cloudflare("CDN\n DDoS Protection")

    with Cluster("AWS"):
        with Cluster("VPC"):
            elb = ELB("Elastic Load Balancer")
            eb = EB("Elastic Beanstalk")
            es = ES("Elasticsearch")
            lmda = Lambda("Lambda")
        ecr = ECR("Container Registry")

    with Cluster("3rd Party SaaS", direction='LR', graph_attr={'newrank': 'true', 'rank': 'same'}):
        with Cluster("MongoDB Atlas"):
            eb >> MongoDB("Users DB")

        with Cluster("Recombee"):
            eb >> Recombee("Recommendation\n Engine")

        with Cluster("Auth0"):
            eb >> Auth0("Oauth2 Integrator")

    eb << ecr << ci
    es << lmda
    clf >> elb >> eb >> es