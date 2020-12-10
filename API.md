# API Reference

**Classes**

Name|Description
----|-----------
[MediaPackageCustom](#cdk-mediapackage-custom-mediapackagecustom)|*No description*


**Structs**

Name|Description
----|-----------
[MediaPackageOptions](#cdk-mediapackage-custom-mediapackageoptions)|*No description*



## class MediaPackageCustom  <a id="cdk-mediapackage-custom-mediapackagecustom"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new MediaPackageCustom(scope: Construct, id: string, props: MediaPackageOptions)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[MediaPackageOptions](#cdk-mediapackage-custom-mediapackageoptions)</code>)  *No description*
  * **maxVideoBitsPerSecond** (<code>number</code>)  *No description* 
  * **mediaPackageName** (<code>string</code>)  MediaPackage name. 
  * **minVideoBitsPerSecond** (<code>number</code>)  *No description* 
  * **playlistWindowSeconds** (<code>number</code>)  *No description* 
  * **segmentDurationSeconds** (<code>number</code>)  *No description* 
  * **streamOrder** (<code>string</code>)  *No description* 




## struct MediaPackageOptions  <a id="cdk-mediapackage-custom-mediapackageoptions"></a>






Name | Type | Description 
-----|------|-------------
**maxVideoBitsPerSecond** | <code>number</code> | <span></span>
**mediaPackageName** | <code>string</code> | MediaPackage name.
**minVideoBitsPerSecond** | <code>number</code> | <span></span>
**playlistWindowSeconds** | <code>number</code> | <span></span>
**segmentDurationSeconds** | <code>number</code> | <span></span>
**streamOrder** | <code>string</code> | <span></span>



