# sandbox url: [https://ateitis-portal.duckdns.org/](https://ateitis-portal.duckdns.org/)

# 1. Enable required Google Cloud APIs
gcloud services enable \
  run.googleapis.com \
  compute.googleapis.com \
  iap.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  --project=iap-learning-sandbox

# 2. Grant Cloud Build source-bucket access
gcloud storage buckets add-iam-policy-binding \
  gs://run-sources-iap-learning-sandbox-us-central1 \
  --member="serviceAccount:125883305568-compute@developer.gserviceaccount.com" \
  --role="roles/storage.objectViewer"

# 3. Grant log-writing permission to the build service account
gcloud projects add-iam-policy-binding iap-learning-sandbox \
  --member="serviceAccount:125883305568-compute@developer.gserviceaccount.com" \
  --role="roles/logging.logWriter"

# 4. Grant Cloud Run builder permission
gcloud projects add-iam-policy-binding iap-learning-sandbox \
  --member="serviceAccount:125883305568-compute@developer.gserviceaccount.com" \
  --role="roles/run.builder"

# 5. Deploy the Node.js app to Cloud Run
gcloud run deploy iap-sandbox-app \
  --source . \
  --project=iap-learning-sandbox \
  --region=us-central1 \
  --no-allow-unauthenticated \
  --ingress=internal-and-cloud-load-balancing

# 6. Verify the Cloud Run service
gcloud run services describe iap-sandbox-app \
  --project=iap-learning-sandbox \
  --region=us-central1 \
  --format="yaml(metadata.name,status.url,status.latestReadyRevisionName)"

# 7. Check Cloud Run IAM policy
gcloud run services get-iam-policy iap-sandbox-app \
  --project=iap-learning-sandbox \
  --region=us-central1

# 8. Reserve a global external IPv4 address
gcloud compute addresses create iap-sandbox-ip \
  --project=iap-learning-sandbox \
  --global \
  --ip-version=IPV4 \
  --network-tier=PREMIUM

# 9. Verify the reserved IP address
gcloud compute addresses describe iap-sandbox-ip \
  --project=iap-learning-sandbox \
  --global

# 10. Verify that no global backend services exist yet
gcloud compute backend-services list \
  --project=iap-learning-sandbox \
  --global

# 11. Verify whether the serverless NEG exists
gcloud compute network-endpoint-groups describe iap-sandbox-neg \
  --project=iap-learning-sandbox \
  --region=us-central1

# 12. Create the serverless NEG for Cloud Run
gcloud compute network-endpoint-groups create iap-sandbox-neg \
  --project=iap-learning-sandbox \
  --region=us-central1 \
  --network-endpoint-type=serverless \
  --cloud-run-service=iap-sandbox-app

# 13. Verify the serverless NEG
gcloud compute network-endpoint-groups describe iap-sandbox-neg \
  --project=iap-learning-sandbox \
  --region=us-central1 \
  --format="yaml(name,networkEndpointType,cloudRun)"

# 14. Create the global backend service
gcloud compute backend-services create iap-sandbox-backend \
  --project=iap-learning-sandbox \
  --load-balancing-scheme=EXTERNAL_MANAGED \
  --global

# 15. Verify the backend service
gcloud compute backend-services describe iap-sandbox-backend \
  --project=iap-learning-sandbox \
  --global \
  --format="yaml(name,loadBalancingScheme,backends,protocol,enableCDN,iap)"

# 16. Attach the serverless NEG to the backend service
gcloud compute backend-services add-backend iap-sandbox-backend \
  --project=iap-learning-sandbox \
  --global \
  --network-endpoint-group=iap-sandbox-neg \
  --network-endpoint-group-region=us-central1

# 17. Verify the backend-to-NEG connection
gcloud compute backend-services describe iap-sandbox-backend \
  --project=iap-learning-sandbox \
  --global \
  --format="yaml(name,loadBalancingScheme,backends)"

# 18. Check backend health information
gcloud compute backend-services get-health iap-sandbox-backend \
  --project=iap-learning-sandbox \
  --global

# 19. List existing global URL maps
gcloud compute url-maps list \
  --project=iap-learning-sandbox

# 20. Create the URL map
gcloud compute url-maps create iap-sandbox-url-map \
  --project=iap-learning-sandbox \
  --default-service=iap-sandbox-backend

# 21. Verify the URL map
gcloud compute url-maps describe iap-sandbox-url-map \
  --project=iap-learning-sandbox \
  --format="yaml(name,defaultService)"

# 22. Create the target HTTP proxy
gcloud compute target-http-proxies create iap-sandbox-http-proxy \
  --project=iap-learning-sandbox \
  --url-map=iap-sandbox-url-map

# 23. Verify the target HTTP proxy
gcloud compute target-http-proxies describe iap-sandbox-http-proxy \
  --project=iap-learning-sandbox \
  --format="yaml(name,urlMap)"

# 24. Create the global forwarding rule
gcloud compute forwarding-rules create iap-sandbox-http-rule \
  --project=iap-learning-sandbox \
  --global \
  --target-http-proxy=iap-sandbox-http-proxy \
  --address=iap-sandbox-ip \
  --ports=80 \
  --network-tier=PREMIUM

# 25. Verify the forwarding rule
gcloud compute forwarding-rules describe iap-sandbox-http-rule \
  --project=iap-learning-sandbox \
  --global \
  --format="yaml(name,IPAddress,IPProtocol,portRange,target)"

# 26. Test the setup
curl -v --http1.1 --max-time 20 http://34.149.85.252/

# 27. Generate self-signed certificate
openssl req -x509 -nodes \
  -days 30 \
  -newkey rsa:2048 \
  -keyout iap-sandbox.key \
  -out iap-sandbox.crt \
  -subj "/CN=34.149.85.252" \
  -addext "subjectAltName=IP:34.149.85.252"

# 28. Verify the certificate
openssl x509 -in iap-sandbox.crt \
  -noout -subject -issuer -dates -ext subjectAltName

# 29. Create SSL certificate in GCP
gcloud compute ssl-certificates create iap-sandbox-cert \
  --project=iap-learning-sandbox \
  --certificate=iap-sandbox.crt \
  --private-key=iap-sandbox.key \
  --global

# 30. Verify the SSL certificate
gcloud compute ssl-certificates describe iap-sandbox-cert \
  --project=iap-learning-sandbox \
  --global

# 31. Update the target HTTPS proxy to use the SSL certificate
gcloud compute target-https-proxies create iap-sandbox-https-proxy \
  --project=iap-learning-sandbox \
  --url-map=iap-sandbox-url-map \
  --ssl-certificates=iap-sandbox-cert

# 32. Verify the target HTTPS proxy
gcloud compute target-https-proxies describe iap-sandbox-https-proxy \
  --project=iap-learning-sandbox \
  --format="yaml(name,urlMap,sslCertificates)"


# 33. Create the global forwarding rule for HTTPS
gcloud compute forwarding-rules create iap-sandbox-https-rule \
  --project=iap-learning-sandbox \
  --global \
  --target-https-proxy=iap-sandbox-https-proxy \
  --address=iap-sandbox-ip \
  --ports=443 \
  --network-tier=PREMIUM

# 34. Verify the HTTPS forwarding rule
gcloud compute forwarding-rules describe iap-sandbox-https-rule \
  --project=iap-learning-sandbox \
  --global \
  --format="yaml(name,IPAddress,IPProtocol,portRange,target)"

# 35. Test the HTTPS setup
curl -vk --http1.1 --max-time 30 https://34.149.85.252/

# 36. Create IAP service account
gcloud alpha services identity create \
  --service=iap.googleapis.com \
  --project=iap-learning-sandbox

# 37. Verify the IAP service account
gcloud run services get-iam-policy iap-sandbox-app \
  --project=iap-learning-sandbox \
  --region=us-central1


# 38. Update the backend service to enable IAP
gcloud compute backend-services update iap-sandbox-backend \
  --project=iap-learning-sandbox \
  --global \
  --iap=enabled

# 39. Verify IAP is enabled
gcloud compute backend-services describe iap-sandbox-backend \
  --project=iap-learning-sandbox \
  --global \
  --format="yaml(name,iap)"

# 40. Add IAP service account to Run invoker role
gcloud run services add-iam-policy-binding iap-sandbox-app \
  --project=iap-learning-sandbox \
  --region=us-central1 \
  --member="serviceAccount:service-125883305568@gcp-sa-iap.iam.gserviceaccount.com" \
  --role="roles/run.invoker"

# 41. Verify the IAM policy
gcloud run services get-iam-policy iap-sandbox-app \
  --project=iap-learning-sandbox \
  --region=us-central1

# 42. Add IAP access for a user
gcloud iap web add-iam-policy-binding \
  --project=iap-learning-sandbox \
  --resource-type=backend-services \
  --service=iap-sandbox-backend \
  --member="user:abdullahjaved4504@gmail.com" \
  --role="roles/iap.httpsResourceAccessor"

# 43. Verify the IAP policy
gcloud iap web get-iam-policy \
  --project=iap-learning-sandbox \
  --resource-type=backend-services \
  --service=iap-sandbox-backend

# 44. Create a new SSL certificate for the domain
gcloud compute ssl-certificates create iap-sandbox-duckdns-cert \
  --project=iap-learning-sandbox \
  --global \
  --domains=ateitis-portal.duckdns.org

# 45. Update the target HTTPS proxy to use the new certificate
gcloud compute target-https-proxies update iap-sandbox-https-proxy \
  --project=iap-learning-sandbox \
  --global \
  --ssl-certificates=iap-sandbox-duckdns-cert

# 46. Verify the SSL certificate is attached
gcloud compute ssl-certificates describe iap-sandbox-duckdns-cert \
  --project=iap-learning-sandbox \
  --global \
  --format="yaml(name,type,managed.status,managed.domainStatus)"

# 47. Update the target HTTPS proxy to use both certificates
gcloud compute target-https-proxies update iap-sandbox-https-proxy \
  --project=iap-learning-sandbox \
  --global \
  --ssl-certificates=iap-sandbox-cert,iap-sandbox-duckdns-cert \
  --global-ssl-certificates


# 48. Verify the SSL certificate is attached
gcloud compute ssl-certificates describe iap-sandbox-duckdns-cert \
  --project=iap-learning-sandbox \
  --global \
  --format="yaml(name,type,managed.status,managed.domainStatus)"

# 49 disable default url
gcloud run services update iap-sandbox-app \
  --project=iap-learning-sandbox \
  --region=us-central1 \
  --no-default-url

# 50 Remove IAM policy binding
gcloud run services remove-iam-policy-binding iap-sandbox-app \
  --project=iap-learning-sandbox \
  --region=us-central1 \
  --member="user:abdullahjaved4504@gmail.com" \
  --role="roles/run.invoker"

# 51 Add IAP policy binding for group
gcloud iap web add-iam-policy-binding \
  --project=iap-learning-sandbox \
  --resource-type=backend-services \
  --service=iap-sandbox-backend \
  --member="group:iap-sandbox-testers@googlegroups.com" \
  --role="roles/iap.httpsResourceAccessor"