import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "node:path";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Duration } from "aws-cdk-lib";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ShopCdk2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromVpcAttributes(this, "VPC", {
      vpcId: "vpc-01066931d7d704ff1",
      availabilityZones: [
        "us-east-1c",
        "us-east-1f",
        "us-east-1b",
        "us-east-1e",
        "us-east-1a",
        "us-east-1d",
      ],
      privateSubnetIds: [
        "subnet-0349bdca498774983",
        "subnet-0535c9e3386cd1dc2",
        "subnet-08c2e19054a595562",
        "subnet-064e3b1d267f3fbd5",
        "subnet-08e314842c8b8dccf",
        "subnet-0d7343de316ce33dd",
      ],
    });

    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      "SG",
      "sg-052d950922b260a88",
      {
        mutable: false,
      }
    );

    // generic default handler for any API function that doesn't get its own Lambda method
    const default_fn = new lambdaNodejs.NodejsFunction(
      this,
      "LambdaDefaultFunction",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: "default.handler",
        code: lambda.Code.fromAsset(path.join(__dirname, "default")),
        vpc: vpc, // Reference the VPC defined above
        securityGroups: [securityGroup], // Associate the security group
        timeout: Duration.seconds(3), // Example timeout, adjust as needed
      }
    );

    const api_endpoint = new apigw.LambdaRestApi(this, `shopapi`, {
      handler: default_fn,
      restApiName: `ShopCompAPI2`,
      proxy: false,
      defaultCorsPreflightOptions: {
        // Optional BUT very helpful: Add CORS configuration
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
      },
    });

    const listChainsResource = api_endpoint.root.addResource("list-chains");
    const createChainResource = api_endpoint.root.addResource("add-chain");
    const removeChainResource = api_endpoint.root.addResource("remove-chain");
    const removeStoreResource = api_endpoint.root.addResource("remove-store");
    const addStoreResource = api_endpoint.root.addResource("add-store");
    const listAllStoresResource = api_endpoint.root.addResource("list-all-stores")
    const listStoresResource = api_endpoint.root.addResource("list-stores")
    const submitReceiptResource = api_endpoint.root.addResource("submit-receipt");
    const adminChainsResource = api_endpoint.root.addResource("admin-chains");
    const adminStoresResource = api_endpoint.root.addResource("admin-stores");
    const reviewHistoryResource = api_endpoint.root.addResource("review-history");
    const registerShopperResource = api_endpoint.root.addResource('register-shopper')
    const reviewActivityResource = api_endpoint.root.addResource('review-activity')

    
    //Shopping List Functions:
    const getShoppingListsResource = api_endpoint.root.addResource('get-shopping-lists')
    const getShoppingListEntriesResource = api_endpoint.root.addResource('get-shopping-list-entries')
    const getShoppingListsAndEntriesResource = api_endpoint.root.addResource('get-shopping-lists-and-entries')
    const createShoppingListResource = api_endpoint.root.addResource('create-shopping-list')
    const addToShoppingListResource = api_endpoint.root.addResource('add-to-shopping-list')
    const editShoppingListEntryResource = api_endpoint.root.addResource('edit-shopping-list-entry')
    const removeFromShoppingListResource = api_endpoint.root.addResource('remove-from-shopping-list')
    const deleteShoppingListResource = api_endpoint.root.addResource('delete-shopping-list')
    const reportShoppingListOptionsResource = api_endpoint.root.addResource('report-shopping-list-options')
    
    const searchRecentPurchasesResource = api_endpoint.root.addResource('search-recent-purchases')

    const getParamTemplates = (queryParams: string[]) => {
      if (!queryParams || queryParams.length === 0) {
        return {}; // Returns empty object if no params (Legacy behavior)
      }

      // Map params: "userId": "$input.params('userId')"
      const paramMappings = queryParams
        .map((param) => `"${param}": "$input.params('${param}')"`)
        .join(",\n");

      return {
        requestTemplates: {
          // Wrap body and params together
          "application/json": `{
              "body": $input.json('$'), 
              ${paramMappings}
          }`,
        },
      };
    };

    const integration_parameters = {
      proxy: false,
      passthroughBehavior: apigw.PassthroughBehavior.WHEN_NO_MATCH,
      integrationResponses: [
        {
          // Successful response from the Lambda function, no filter defined
          statusCode: "200",
          responseTemplates: {
            "application/json": "$input.json('$')", // should just pass JSON through untouched
          },
          responseParameters: {
            "method.response.header.Content-Type": "'application/json'",
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Credentials": "'true'",
          },
        },
        {
          // For errors, we check if the error message is not empty, get the error data
          selectionPattern: "(\n|.)+",
          statusCode: "400",
          responseTemplates: {
            "application/json": JSON.stringify({
              state: "error",
              message: "$util.escapeJavaScript($input.path('$.errorMessage'))",
            }),
          },
          responseParameters: {
            "method.response.header.Content-Type": "'application/json'",
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Credentials": "'true'",
          },
        },
      ],
    };

    const response_parameters = {
      methodResponses: [
        {
          // Successful response from the integration
          statusCode: "200",
          // Define what parameters
          responseParameters: {
            "method.response.header.Content-Type": true,
            "method.response.header.Access-Control-Allow-Origin": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
          },
        },
        {
          // Same thing for the error responses
          statusCode: "400",
          responseParameters: {
            "method.response.header.Content-Type": true,
            "method.response.header.Access-Control-Allow-Origin": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
          },
        },
      ],
    };

    // Path parameter specific configurations - use proxy integration for path parameters
    const path_parameter_integration = {
      proxy: true,
    };

    const path_response_parameters = {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Content-Type": true,
            "method.response.header.Access-Control-Allow-Origin": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
          },
        },
        {
          statusCode: "400",
          responseParameters: {
            "method.response.header.Content-Type": true,
            "method.response.header.Access-Control-Allow-Origin": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
          },
        },
      ],
    };
    /* Follow this pattern to add new lambda functions =====================================================================
        const default_fn = new lambdaNodejs.NodejsFunction(
          this,
          "LambdaDefaultFunction",
          {
            runtime: lambda.Runtime.NODEJS_22_X,
            handler: "default.handler",
            code: lambda.Code.fromAsset(path.join(__dirname, "default")),
            vpc: vpc, // Reference the VPC defined above
            securityGroups: [securityGroup], // Associate the security group
            timeout: Duration.seconds(3), // Example timeout, adjust as needed
          }
        );
        */

    const createFn = (fnName: string, handlerName: string) => {
      return new lambdaNodejs.NodejsFunction(this, fnName, {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: `${handlerName}.handler`,
        code: lambda.Code.fromAsset(path.join(__dirname, handlerName)),
        vpc: vpc, // Reference the VPC defined above
        securityGroups: [securityGroup], // Associate the security group
        timeout: Duration.seconds(3), // Example timeout, adjust as needed
      });
    };

    const addGetMethod = (
      resource: any,
      fn: any,
      queryParams: string[] = []
    ) => {
      resource.addMethod(
        "GET",
        new apigw.LambdaIntegration(fn, {
          ...integration_parameters,
          ...getParamTemplates(queryParams),
        }),
        response_parameters
      );
    };

    const addPostMethod = (
      resource: any,
      fn: any,
      queryParams: string[] = []
    ) => {
      resource.addMethod(
        "POST",
        new apigw.LambdaIntegration(fn, {
          ...integration_parameters,
          ...getParamTemplates(queryParams),
        }),
        response_parameters
      );
    };
    
    const listChains = createFn("ListChainsFunction", "list-chains");
    const createChain = createFn("AddChainFunction", "add-chain");
    const removeChain = createFn("removeChainFunction", "remove-chain")
    const adminStores = createFn("AdminStores", "admin-stores");
    const adminChains = createFn("AdminChains", "admin-chains");
    const addStore = createFn("AddStoreFunction", "add-store");
    const listAllStores = createFn(
      "ListAllStoresFunction",
      "list-all-stores"
    );
    const registerShopper = createFn("RegisterShopperFunction", "register-shopper")
    const removeStore = createFn("RemoveStoreFunction", "remove-store")
    const listStores = createFn("ListStoresFunction", "list-stores")
    const reviewHistory = createFn("ReviewHistoryFunction", "review-history")
    const submitReceipt = createFn("SubmitReceiptFunction", "submit-receipt");
    const reviewActivity = createFn("ReviewActivityFunction", "review-activity")

    //Shopping List Functions:
    const getShoppingLists = createFn("getShoppingListsFunction", "get-shopping-lists")
    const getShoppingListEntries = createFn("getShoppingListEntriesFunction", "get-shopping-list-entries")
    const getShoppingListsAndEntries = createFn("getShoppingListsAndEntriesFunction", "get-shopping-lists-and-entries")
    const createShoppingList = createFn("CreateShoppingListFunction", "create-shopping-list")
    const addToShoppingList = createFn("AddToShoppingListFunction", "add-to-shopping-list")
    const editShoppingListEntry = createFn("EditShoppingListEntryFunction", "edit-shopping-list-entry")
    const removeFromShoppingList = createFn("RemoveFromShoppingListFunction", "remove-from-shopping-list")
    const deleteShoppingList = createFn("DeleteShoppingListFunction", "delete-shopping-list")
    const reportShoppingListOptions = createFn("reportShoppingListOptionsFunction", "report-shopping-list-options")

    const searchRecentPurchases = createFn("SearchRecentPurchasesFunction", "search-recent-purchases")

    addPostMethod(removeChainResource, removeChain)
    addPostMethod(removeStoreResource, removeStore)
    addGetMethod(listChainsResource, listChains)
    addPostMethod(addStoreResource, addStore)
    addGetMethod(listAllStoresResource, listAllStores)

    addPostMethod(createChainResource, createChain)
    addGetMethod(adminStoresResource, adminStores)
    addGetMethod(adminChainsResource, adminChains)

    //Shopping List Functions:
    addGetMethod(getShoppingListsResource, getShoppingLists, ['shopperID'])
    addGetMethod(getShoppingListEntriesResource, getShoppingListEntries, ['listID'])
    addGetMethod(getShoppingListsAndEntriesResource, getShoppingListsAndEntries, ['shopperID'])
    addPostMethod(createShoppingListResource, createShoppingList)
    addPostMethod(addToShoppingListResource, addToShoppingList)
    addPostMethod(editShoppingListEntryResource, editShoppingListEntry)
    addPostMethod(removeFromShoppingListResource, removeFromShoppingList)
    addPostMethod(deleteShoppingListResource, deleteShoppingList)
    addGetMethod(reportShoppingListOptionsResource, reportShoppingListOptions, ['listID', 'numResults'])
    
    addPostMethod(submitReceiptResource, submitReceipt)
    addGetMethod(reviewHistoryResource, reviewHistory, ['shopperID'])
    addGetMethod(listStoresResource, listStores, ['chainID'])
    addGetMethod(reviewActivityResource, reviewActivity, ['period', 'shopperID'])
    addGetMethod(searchRecentPurchasesResource, searchRecentPurchases, ['shopperID', 'query']);
  }
}