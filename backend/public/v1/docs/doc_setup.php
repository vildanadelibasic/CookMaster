<?php
/**
* @OA\Info(
*     title="API",
*     description="CookMaster API",
*     version="1.0",
*     @OA\Contact(
*         email="vildana.delibasic@student.ibu.edu.ba",
*         name="Web Programming"
*     )
* )
*/
/**
* @OA\Server(
*     url= "http://localhost/CookMaster/backend",
*     description="API server"
* )
*/
/**
* @OA\SecurityScheme(
*     securityScheme="ApiKey",
*     type="apiKey",
*     in="header",
*     name="Authentication"
* )
*/