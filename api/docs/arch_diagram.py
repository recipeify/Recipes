from diagrams import Cluster, Diagram, Edge
from diagrams.aws.compute import EB, ECR, Lambda
from diagrams.aws.analytics import ES
from diagrams.aws.network import ELB
from diagrams.onprem.database import MongoDB
from diagrams.onprem.vcs import Github
from diagrams.saas.identity import Auth0
from diagrams.saas.cdn import Cloudflare
from diagrams.saas.recommendation import Recombee
from diagrams.saas.media import Cloudinary


def main():
    with Diagram("Recipeify Architecture", direction='LR'):

        with Cluster("Github"):
            ci = Github("Actions CI/CD")
            Github("Open Source Repo") >> ci



        with Cluster("Cloudfare"):
            clf = Cloudflare("CDN\n DDoS Protection")

        with Cluster("AWS", direction='LR'):
            with Cluster("VPC"):
                elb = ELB("Elastic Load Balancer")
                eb = EB("Elastic Beanstalk")
                es = ES("Elasticsearch")
                lmda = Lambda("Lambda")
            ecr = ECR("Container Registry")

        with Cluster("3rd Party SaaS", direction='LR'):
            with Cluster("MongoDB Atlas"):
                mongo = MongoDB("Users DB")

            with Cluster("Recombee"):
                rec = Recombee("Recommendation\n Engine")

            with Cluster("Auth0"):
                auth = Auth0("Oauth2 Integrator")

            with Cluster("Cloudinary"):
                cl = Cloudinary("Image Caching\n and Proccessing")

            auth >> Edge(style="invis") >> mongo >> Edge(style="invis") >> cl >> Edge(style="invis") >> rec

        eb >> auth
        eb >> mongo
        eb >> cl
        eb >> rec

        eb << ecr << ci
        es << lmda
        clf >> elb >> eb >> es


if __name__ == "__main__":
    main()