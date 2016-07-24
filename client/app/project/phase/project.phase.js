'use strict';

angular.module('myApp.project.phase', ['ngRoute', 'ngDialog'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/project/view/:id/phase/edit',{
                templateUrl: 'project/phase/phase.edit.html',
                controller: 'PhaseCntrl'
            })
            .when('/project/view/:id/phase/:phase',{
                templateUrl: 'project/phase/phase.view.html',
                controller: 'PhaseCntrl'
            });
    }])
    .controller('PhaseCntrl', ['$rootScope','$scope','ngDialog', '$location', '$routeParams', 'UserService', 'ProjectService', 'TemplateService',
        function ($rootScope, $scope, ngDialog, $location, $routeParams, UserService, ProjectService, TemplateService) {

            $scope.project = {};
            $scope.check = check;
            $scope.progress = progress;
            $scope.openUpload = openUpload;
            $scope.canProgress = canProgress;
            $scope.signoff = signoff;
            $scope.shouldSignOff = shouldSignOff;

            $scope.selected_phase = '';
            init();

            function openUpload(milestone, userid) {
                console.log('Milestone to update: ' + milestone);
                $scope.userid = userid;
                $scope.title = "Upload an Artifact";
                console.log('open for upload file');
                ngDialog
                    .openConfirm({
                        template: 'media/upload/upload.html',
                        controller: 'UploadMediaCtrl',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    })
                    .then(function (media) {
                        console.log('Value on ok: ' + JSON.stringify(media));
                        var id = $routeParams.id;
                        var phase = $routeParams.phase;
                        ProjectService.GetById(id)
                            .then(function (res) {
                                console.log('Project : ' + JSON.stringify(res));
                                if (res.success) {
                                    var prj = res.data;

                                    var curr_index = prj.template.phases.length, new_index = prj.template.phases.length;
                                    for ( var i = 0; i < prj.template.phases.length; i++)
                                    {
                                        if(prj.template.phases[i] === prj.current_phase) {
                                            curr_index = i;
                                            break;
                                        }
                                    }
                                    for ( var j = 0; j < prj.template.phases.length; j++)
                                    {
                                        if(prj.template.phases[j] === phase) {
                                            new_index = j;
                                            break;
                                        }
                                    }

                                    if(new_index < curr_index)
                                        prj.current_phase = phase;

                                    for (var index=0; index < prj.milestones.length; index++)
                                    {
                                        if(prj.milestones[index].name === milestone)
                                        {
                                            console.log('Milestone matched');
                                            if(prj.milestones[index].media === undefined)
                                            {
                                                prj.milestones[index].media = [];
                                            }
                                            console.log('Media pushed in milestone: '+ JSON.stringify(media));

                                            prj.milestones[index].media.push(media._id);
                                            break;
                                        }
                                    }
                                    console.log('Milestones for project before update : ' + JSON.stringify(prj.milestones));
                                    console.log('Project before update : ' + JSON.stringify(prj));
                                    ProjectService.Update(prj)
                                        .then(function (res) {
                                            console.log('Project : ' + JSON.stringify(res));
                                            if (res.success) {
                                                $scope.project = res.data;
                                                //$location.path('/project/view/' + prj._id + '/phase/' + phase);
                                            }
                                        });
                                }
                            });

                    }, function(value) {
                        console.log('Value on cancel: ' + JSON.stringify(value));
                    });
            }
            function canProgress(ph, sel_ph, uid, owner) {
                if(owner !== undefined) {
                    console.log("canProgress: phase: " + ph + " Selected phase:" + sel_ph + " User id: " + uid + " Owner" + owner._id);
                    return (ph === sel_ph && uid === owner._id);
                }
                return false;
            }

            function progress(id, sel_phase) {
                sel_phase = decodeURI(sel_phase);
                console.log("Selected phase is:" + sel_phase);
                ProjectService.GetById(id)
                    .then(function (res) {
                        console.log('Inside progress Project : ' + JSON.stringify(res));
                        if (res.success) {
                            var prj = res.data, i = 0;
                            if (prj.current_phase === sel_phase) {
                                for (i = 0; i < prj.template.phases.length; i++) {
                                    if (prj.template.phases[i] === sel_phase) {
                                        break;
                                    }
                                }
                                if (i < prj.template.phases.length - 1) {
                                    prj.current_phase = prj.template.phases[i+1];
                                }
                                if (i === prj.template.phases.length - 1) {
                                    prj.current_phase = '!comple';
                                }
                                console.log('Project before update : ' + JSON.stringify(prj));
                                ProjectService.Update(prj)
                                    .then(function (res) {
                                        console.log('Project : ' + JSON.stringify(res));
                                        if (res.success) {
                                            $location.path('/project/view/' + prj._id + '/phase/' + sel_phase);
                                        }
                                    });
                            }
                        }
                    });
            }

            function init() {

                console.log('inside phase view init');
                var id = $routeParams.id;
                $scope.selected_phase = $routeParams.phase;
                ProjectService.GetById(id)
                    .then(function (res) {
                        console.log('Project : ' + JSON.stringify(res));
                        if (res.success) {
                            $scope.project = res.data;
                        }
                    });
            }

            function check(signer, stake) {
                console.log('inside check - signer: ' + JSON.stringify(signer) + ' stake: ' + JSON.stringify(stake));
                if (signer !== undefined) {
                    return signer.find(function (s) {
                        return s.by !== undefined && s.by._id === stake._id;
                    });
                }
                return undefined;
            }

            function shouldSignOff(milestone, signer, stakeholders, user_id) {
                console.log('inside shouldSignOff check - '
                        + ' milestone: ' + milestone
                        + ' signer: ' + JSON.stringify(signer)
                        + ' stake: ' + JSON.stringify(stakeholders)
                        + ' user_id: ' + user_id);
                var alreadySigned = false, enableSignOff = false;
                if (signer !== undefined) {
                    alreadySigned = signer.find(function (s) {
                        return s.by !== undefined && s.by !== null && s.by._id === user_id;
                    });
                }

                if (!alreadySigned) {
                    if (stakeholders !== undefined) {
                        enableSignOff = stakeholders.find(function (s) {
                            return s._id === user_id;
                        });
                    }
                }

                return enableSignOff;
            }

            function signoff(milestone, user_id) {
                var id = $routeParams.id;
                var phase = $routeParams.phase;
                ProjectService.GetById(id)
                    .then(function (res) {
                        console.log('Project : ' + JSON.stringify(res));
                        if (res.success) {
                            var prj = res.data;

                            for (var index=0; index < prj.milestones.length; index++)
                            {
                                if(prj.milestones[index].name === milestone)
                                {
                                    if(prj.milestones[index].sign_off === undefined) {
                                        prj.milestones[index].sign_off = [];
                                    }
                                    var user = {by:user_id, approved:true};
                                    prj.milestones[index].sign_off.push(user);
                                    break;
                                }
                            }

                            console.log('Project before update : ' + JSON.stringify(prj));
                            ProjectService.Update(prj)
                                .then(function (res) {
                                    console.log('Project : ' + JSON.stringify(res));
                                    if (res.success) {
                                        $location.path('/project/view/' + prj._id + '/phase/' + phase);
                                    }
                                });
                        }
                    });
            }
        }])
;