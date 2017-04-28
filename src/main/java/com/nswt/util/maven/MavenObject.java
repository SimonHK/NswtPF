package com.nswt.util.maven;

/**
 * Created by hongkai on 2017/4/25.
 */
public class MavenObject {

    /**
     * Maven 对象属性
     * @param  shellpath //shell文件路径
     * @param  appName  //应用名称在maven中表述是ArtifactId
     * @param  workPath //要构建应用生成的目标地址
     * @param  archetype //maven 构建类型generate 通过模板构建应用
     * @param  archetypeCatalog //archetypeCatalog默认是maven官网的archetype-catalog.xml地址速度会因网络原因很慢所以这里指定为local
     * @param  groupId //当前创建应用的组织ID 例如:groupId=com.nswt
     * @param  version //当前创建应用的版本号 例如:version=1.0-SNAPSHOT
     * @param  archetypeGroupId //构建当前应用需要使用的模板为那个组织的ID 例如: archetypeGroupId=com.nswt
     * @param  archetypeArtifactId //构建当前应用使用的模板的名称也就是模板的ArtifactId 例如: archetypeArtifactId=nswt-web-archetype
     * @param  archetypeVersion //构建当前应用使用的模板版本号 例如:archetypeVersion="1.0
     * @param  archetypeRepository //构建当前应用使用的基础模板是那个仓库提供的,例如:archetypeRepository="http://192.168.2.86:9091/nexus/content/groups/public/archetype-catalog.xml
     * @param  packagename //当前创建应用的包名,例如:package=com.test.xxxx
     * @param  interactiveMode //false
     */

    public String shellpath;

    public String appName;

    public String workPath;

    public String archetype;

    public String archetypeCatalog;

    public String groupId;

    public String version;

    public String archetypeGroupId;

    public String archetypeArtifactId;

    public String archetypeVersion;

    public String archetypeRepository;

    public String packagename;

    public String interactiveMode;


    public String getShellpath() {
        return shellpath;
    }

    public void setShellpath(String shellpath) {
        this.shellpath = shellpath;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getWorkPath() {
        return workPath;
    }

    public void setWorkPath(String workPath) {
        this.workPath = workPath;
    }

    public String getArchetype() {
        return archetype;
    }

    public void setArchetype(String archetype) {
        this.archetype = archetype;
    }

    public String getArchetypeCatalog() {
        return archetypeCatalog;
    }

    public void setArchetypeCatalog(String archetypeCatalog) {
        this.archetypeCatalog = archetypeCatalog;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getArchetypeGroupId() {
        return archetypeGroupId;
    }

    public void setArchetypeGroupId(String archetypeGroupId) {
        this.archetypeGroupId = archetypeGroupId;
    }

    public String getArchetypeArtifactId() {
        return archetypeArtifactId;
    }

    public void setArchetypeArtifactId(String archetypeArtifactId) {
        this.archetypeArtifactId = archetypeArtifactId;
    }

    public String getArchetypeVersion() {
        return archetypeVersion;
    }

    public void setArchetypeVersion(String archetypeVersion) {
        this.archetypeVersion = archetypeVersion;
    }

    public String getArchetypeRepository() {
        return archetypeRepository;
    }

    public void setArchetypeRepository(String archetypeRepository) {
        this.archetypeRepository = archetypeRepository;
    }

    public String getPackagename() {
        return packagename;
    }

    public void setPackagename(String packagename) {
        this.packagename = packagename;
    }

    public String getInteractiveMode() {
        return interactiveMode;
    }

    public void setInteractiveMode(String interactiveMode) {
        this.interactiveMode = interactiveMode;
    }

}

