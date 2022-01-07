if(typeof(ysy) != "undefined")
{
  window.custom_fields = window.custom_fields || {};
  window.trackers = window.trackers || {};
  window.col_widths = window.col_widths || {};

  custom_fields['pdt_cf_id'] = $('#pdt_cf_id').val();
  custom_fields['metier_cf_id'] = $('#metier_cf_id').val();
  custom_fields['budget_cf_id'] = $('#budget_cf_id').val();
  custom_fields['poste_resp_cf_id'] = $('#poste_resp_cf_id').val();
  custom_fields['reseau_cf_id'] = $('#reseau_cf_id').val();
  custom_fields['opt_cf_id'] = $('#opt_cf_id').val();
  custom_fields['domaine_cf_id'] = $('#domaine_cf_id').val();
  custom_fields['lbl_activite_cf_id'] = $('#lbl_activite_cf_id').val();
  custom_fields['lbl_ordre_cf_id'] = $('#lbl_ordre_cf_id').val();
  custom_fields['type_cf_id'] = $('#type_cf_id').val();
  custom_fields['ss_dom_cf_id'] = $('#ss_dom_cf_id').val();
  custom_fields['ident_cf_id'] = $('#ident_cf_id').val();
  custom_fields['niveau_cf_id'] = $('#niveau_cf_id').val();
  custom_fields['phase_cf_id'] = $('#phase_cf_id').val();
  custom_fields['stade_cf_id'] = $('#stade_cf_id').val();
  custom_fields['dtard_cf_id'] = $('#dtard_cf_id').val();
  custom_fields['ftard_cf_id'] = $('#ftard_cf_id').val();
  custom_fields['dtot_cf_id'] = $('#dtot_cf_id').val();
  custom_fields['ftot_cf_id'] = $('#ftot_cf_id').val();
  custom_fields['dprev_cf_id'] = $('#dprev_cf_id').val();
  custom_fields['fprev_cf_id'] = $('#fprev_cf_id').val();
  custom_fields['dreel_cf_id'] = $('#dreel_cf_id').val();
  custom_fields['freel_cf_id'] = $('#freel_cf_id').val();
  custom_fields['marker_cf_id'] = $('#marker_cf_id').val();
  custom_fields['max_antecedent_cf_id'] = $('#max_antecedent_cf_id').val();
  custom_fields['blocked_from_cf_id'] = $('#blocked_from_cf_id').val();
  custom_fields['blocked_to_cf_id'] = $('#blocked_to_cf_id').val();

  trackers['ot_tracker_id'] = $('#ot_tracker_id').val();
  trackers['of_tracker_id'] = $('#of_tracker_id').val();
  trackers['jalon_tracker_id'] = $('#jalon_tracker_id').val();
  trackers['tl_tracker_id'] = $('#tl_tracker_id').val();
  
  col_widths['lbl_order_width'] = $('#lbl_order_width').val();
  col_widths['pdt_width'] = $('#pdt_width').val();
  col_widths['opt_width'] = $('#opt_width').val();
  col_widths['ident_width'] = $('#ident_width').val();
  col_widths['niveau_width'] = $('#niveau_width').val();
  col_widths['phase_width'] = $('#phase_width').val();
  col_widths['lbl_activite_width'] = $('#lbl_activite_width').val();
  col_widths['domaine_width'] = $('#domaine_width').val();

  current_user_roles = JSON.parse($('#role').val()); // returns array [1, 8]
  if($('#roles_jalon').val() != "")
  {
    jalon_roles = JSON.parse($('#roles_jalon').val());
    for(var i = 0; i < jalon_roles.length; i++) {
      jalon_roles[i] = parseInt(jalon_roles[i]);
    }
  }
  else
  {
    jalon_roles = [];
  }
  
  
  ysy.log.logLevel = 4;

  //Add this function to render blocked days in gantt
  gantt._render_task_block = function(task, width){
    var block = document.createElement("div");
    block.className = "gantt_task_paint_time";
    block.style.top = '-101px';
    if (task.type === "task" && task.id > 0 && task.blocked_from != '' && task.blocked_to != '')
    {
      if(task.blocked_from != null && task.blocked_to != null)
      {
        block.style.left = (gantt.posFromDate(task.blocked_from) - gantt._get_task_pos(task).x) + 'px';
        block.style.width = (gantt.posFromDate(moment(task.blocked_to).add(1, 'days')) - gantt.posFromDate(task.blocked_from)) + 'px';
      }
    }
    return block;
  };

  //Add this function to render estimated remaining time

  gantt._render_time = function(task, width){
    var time = document.createElement("div");
    time.className = "gantt_side_content gantt_left ";
    time.style.right = '100%';
    time.style.padding.right = '15px';
    time.textContent = task.remaining_hours;

    return time;
  };

  //Add this function to render the marker
  gantt._render_task_marker = function(task, width){
    var marker = document.createElement("div");
    marker.className = "gantt_task_marker";
    marker.style.left = '-40px';
    marker.style.top = '-79px';
    marker.title = task.max_antecedent;
    return marker;
  };

   //Add this function to render the arrow for "date de fin au plutard"
  gantt._render_task_latest_milestone = function(task, width){
    var latest = document.createElement("div");
    latest.className = "gantt_task_latest_milestone";
    var date_x = Math.round(this.posFromDate(moment(task.latest_end_date)) - this.posFromDate(task.start_date)) + 24;
    latest.style.left =  date_x + 'px';
    latest.style.top = '-20px';
    latest.title = task.latest_end_date;
    return latest;
  };
  // Render DP 
  gantt._render_task_dp = function(task, width){
    var dp = document.createElement("div");
    if (task.date_debut_prevue)
    {
      var date_x = Math.round(this.posFromDate(moment(task.date_debut_prevue)) - this.posFromDate(task.start_date));
    }
    dp.style.left = date_x + 'px';
    dp.className = "gantt_task_dp";
    dp.title = task.date_debut_prevue;
    dp.innerHTML="DP";
    
    return dp;
  };
  // Render FP
  gantt._render_task_fp = function(task, width){
    var fp = document.createElement("div");
    var date_x = Math.round(this.posFromDate(moment(task.date_fin_prevue)) - this.posFromDate(task.start_date)) + 18;
    if(ysy.settings.zoom.zoom == "week")
    {
      date_x -= 30 ;
    }
    if(ysy.settings.zoom.zoom == "month")
    {
      date_x -= 33 ;
    }
    fp.className = "gantt_task_fp";
    fp.style.left =  date_x + 'px';
    fp.title = task.date_fin_prevue;
    fp.innerHTML="FP";
    return fp;
  };

  //Override render function to add "date de fin plutard" and color if not valid
  var old_task_default_render = gantt._task_default_render;
  gantt._task_default_render = function(task){
    var div = old_task_default_render.call(this, task);
    var pos = this._get_task_pos(task);
    var height = this._get_task_height();
    var width = gantt._get_task_width(task);
    var padd = Math.floor((this.config.row_height - height)/2);
    if (task.latest_end_date)
    {
      var width = gantt._get_task_width(task);
      var latest = gantt._render_task_latest_milestone(task, width);
      if(task.textColor)
      {
        latest.style.color = task.textColor;
      }
      // if its JALON milestone is set to hidden " in order not to disorder rendered divs"
      if(task.tracker_id == parseInt(trackers['jalon_tracker_id'])){
        latest.style.visibility ="hidden";
      }
      div.appendChild(latest);
    }
    var dp = gantt._render_task_dp(task, width);
    var fp = gantt._render_task_fp(task, width);
    if(task.tracker_id == parseInt(trackers['jalon_tracker_id']) || task.tracker_id == parseInt(trackers['tl_tracker_id']))
    {
      if (!task.date_debut_prevue )
      {
        dp.style.visibility="hidden";
      }
    }
    else
    {
      if(!task.date_debut_prevue || task.date_debut_reel != "" ) 
      {
        dp.style.visibility="hidden";
      }
    }
    if(moment(task.date_debut_prevue) < moment(new Date()).startOf("day"))
    {
      dp.style.color= "red";
    }
    if (task.is_sap_treated == 'false'){
      dp.style.color= "blue";
    }
    div.appendChild(dp);
    if(!task.date_fin_prevue || task.date_fin_reel != "")
    {
      fp.style.visibility="hidden";
    }
    if(moment(task.date_fin_prevue) < moment(new Date()).startOf("day"))
    {
      fp.style.color= "red";
    }
    if (task.is_sap_treated == 'false'){
      fp.style.color= "blue";
    }
    div.appendChild(fp);
     // Render marker
    var marker = gantt._render_task_marker(task, width);
    if (task.marker == "true" && task.progress == 0 && task.start_date <= moment(task.max_antecedent) ){
      div.appendChild(marker);
    }
    else
    {
      marker.style.visibility="hidden";
      div.appendChild(marker);
    }
    // Render block
    var block = gantt._render_task_block(task, width);
    if (task.blocked_to == '' || task.blocked_from == '' || task.blocked_to == null || task.blocked_from == null  || task.type === "project" || task.id < 0)
    {
      block.style.visibility = "hidden";
    }
    div.appendChild(block);
    var time = gantt._render_time(task, width);
    div.appendChild(time);
    if (task.tracker_id == parseInt(trackers['jalon_tracker_id']) || task.tracker_id == parseInt(trackers['tl_tracker_id']))
    {
      time.style.visibility = "hidden";
    }

    
    // overriding task background color to put blue on OF 
    var styles = [
      "left:" + pos.x + "px",
      "top:" + (padd + pos.y) + 'px',
      "height:" + height + 'px',
      "line-height:" + height + 'px',
      "width:" + width + 'px'
    ];
    if(task.color){
      styles.push("background-color:" + task.color);
    }
    if(task.textColor){
      styles.push("color:" + task.textColor);
    }
    if(task.tracker_id == parseInt(trackers['of_tracker_id'])){
      styles.push("background-color:" + "#6687ff");
      styles.push("border-color:" + "#0037ff");
      styles.push("color:" + "#6687ff");
    }
    div.style.cssText = styles.join(";");

    if(this._is_readonly(task)){
      gantt._render_pair(div, "gantt_link_control", task, function(css){
        var outer = document.createElement("div");
        outer.className = css;
        outer.style.cssText = [
          "height:" + height + 'px',
          "line-height:" + height + 'px'
        ].join(";");
        var inner = document.createElement("div");
        inner.className = "gantt_link_point";
        outer.appendChild(inner);
        return outer;
      });
    }
    return div;
  };

  //Override overdue function to use "date de fin au plutard"
  ysy.data.Issue.prototype.problems.overDue = function () {
    if(this.id < 0)
    {
      if(this.parent_overdue)
      {
        return ysy.settings.labels.problems.overdue;
      } 
      else
      {
        return;
      }
    }
    else
    {
      if (this.issue_overdue == true)
      {
        if(this.end_date <= moment(this.date_fin_plutard))
        {
          this.issue_overdue = false;
        }
        else
        {
          return ysy.settings.labels.problems.overdue;
        }
      }
      else if (this.issue_overdue == false && this.end_date > moment(this.date_fin_plutard))
      {
        this.issue_overdue = true;
        return ysy.settings.labels.problems.overdue;
      }
    }
  };

  //Add more data to the issue object
  var old_constructDhData = ysy.view.GanttTask.prototype._constructDhData;
  ysy.view.GanttTask.prototype._constructDhData = function(issue){
    var gantt_issue = old_constructDhData.call(this, issue);
    // we inject value of issue.open in the Helper via params 
    if(gantt_issue["id"] < 0 && issue.open == "on")
    {
      gantt_issue["open"] = true;
    }
    else
    { 
      if(gantt_issue["id"] < 0 )
      {
        gantt_issue["open"] = false;
      }
    }
    $.extend(gantt_issue, {
      latest_end_date: issue.date_fin_plutard,
      date_debut_plutot: issue.date_debut_plutot,
      date_debut_prevue: issue.date_debut_prevue,
      date_debut_plutard: issue.date_debut_plutard,
      date_debut_reel: issue.date_debut_reel,
      date_fin_prevue: issue.date_fin_prevue,
      date_fin_reel: issue.date_fin_reel,
      ident: issue.ident,
      designation: issue.designation,
      comp_id: issue.comp_id,
      pdt: issue.pdt,
      remaining_timeentries: issue.remaining_timeentries,
      tracker_id: issue.tracker_id,
      parent_overdue: issue.parent_overdue,
      marker: issue.marker,
      init_start_date: issue.start_date,
      init_end_date: issue.end_date,
      init_date_debut_prevue: issue.date_debut_prevue,
      init_date_fin_prevue: issue.date_fin_prevue,
      init_duration: gantt.calculateDuration(issue.start_date,issue.end_date),
      max_antecedent: issue.max_antecedent,
      blocked_from: issue.blocked_from,
      blocked_to: issue.blocked_to,
      is_sap_treated: issue.is_sap_treated,
      readonly: issue.readonly,
      remaining_hours: issue.remaining_hours
    });
    return gantt_issue;
  };
  
  //Override get diff function to update custom fields
  var old_getDiff = ysy.data.Issue.prototype.getDiff;
  ysy.data.Issue.prototype.getDiff = function(newObj){
    var diffs = old_getDiff.call(this, newObj);
    /* we check if the start date has changed and put the value in the custom field date plutot */
    if(diffs)
    {
      diffs.custom_field_values = {};
      if(diffs.hasOwnProperty("start_date") || diffs.hasOwnProperty("date_debut_prevue"))
      {
        // update date debut prevue 
        // return old values if new ones are bellow todays date 
        if(moment(diffs.start_date) >= moment(new Date()).startOf("day"))
        {
          diffs.custom_field_values[custom_fields['dprev_cf_id']] = diffs["date_debut_prevue"];
          // update date debut plutôt 
          diffs.custom_field_values[custom_fields['dtot_cf_id']] = diffs["date_debut_prevue"];
        }
        else
        {
          diffs.custom_field_values[custom_fields['ftot_cf_id']] = diffs.due_date;
          return;
        }

      }
      if(diffs.hasOwnProperty("due_date"))
      {
        if(moment(diffs.due_date) < moment(new Date()).startOf("day"))
        {
          return;
        }
        else 
        {
          if(diffs.hasOwnProperty("date_fin_prevue"))
          {
            if(diffs.due_date != this._old.date_fin_prevue)
            {
              diffs.custom_field_values[custom_fields['fprev_cf_id']] = diffs.due_date;
            }
          } 
        } 
      }
      if(diffs.hasOwnProperty("date_fin_prevue") && this.tracker_id == parseInt(trackers['tl_tracker_id']))
      {
        diffs.custom_field_values[custom_fields['fprev_cf_id']] = diffs.date_fin_prevue;
      } 
      if(diffs.hasOwnProperty("done_ratio") && this.tracker_id == parseInt(trackers['tl_tracker_id']))
      {
        if (this._old.done_ratio == 0)
        {
          diffs.custom_field_values[custom_fields['dreel_cf_id']] = (new Date()).toISOString().split("T")[0];
        }
        if(diffs.done_ratio == 100)
        {
          diffs.custom_field_values[custom_fields['ftot_cf_id']] = (new Date()).toISOString().split("T")[0];
        }
      }
    }
    return diffs;
  };
  //Override sorting by default in gantt to use date_debut_plutard instead of date_debut
  var old_selectChildren = ysy.view.GanttTasks.prototype._selectChildren;
  ysy.view.GanttTasks.prototype._selectChildren = function(){
    var issues = this.model.getArray();
    var milestones = ysy.data.milestones.getArray();
    var projects = ysy.data.projects.getArray();
    var combined =  issues.concat(milestones, projects);
    combined.sort(function (a, b) {
      if (a.isProject !== b.isProject) {
        if (a.isProject) {
          return a.id === ysy.settings.projectID ? -1 : 1;
        }
        return b.id === ysy.settings.projectID ? 1 : -1;
      }
      var aStart = a.date_debut_plutard || a.date_debut_plutard;
      var bStart = b.date_debut_plutard || b.date_debut_plutard;
      if (!aStart) return bStart ? -1 : 0;
      if (!bStart) return 1;
      return aStart - bStart;
    });
    return combined;
  };

  // overriding resize method to add progress condition 
  // this function works while dnd is in progress
old_TasksDnd_Resize = gantt._tasks_dnd._resize;
gantt._tasks_dnd._resize = function(ev, shift, drag){
  old_TasksDnd_Resize.call(this, ev, shift, drag);
  if(drag.left)
  {
    if (ev.start_date >= moment(new Date()).startOf("day") )
    {
      ev.date_debut_prevue = ev.start_date.toISOString(true);
    }
    if (ev.start_date < moment(new Date()).startOf("day") )
    {
      ev.date_debut_prevue = ev.init_date_debut_prevue;
    }
  }
  else 
  {
    if (ev.progress == 0)
    {
      if (ev.end_date >= moment(new Date()).startOf("day") )
      {
        ev.date_debut_prevue = ev.start_date.toISOString(true);
      }
      if (ev.end_date < moment(new Date()).startOf("day") )
      {
        ev.date_debut_prevue = ev.init_date_debut_prevue;
      }
    }
    else 
    {
      if (ev.end_date >= moment(new Date()).startOf("day"))
      {
        ev.date_fin_prevue = ev.end_date.toISOString(true);
      }
      if (ev.end_date < moment(new Date()).startOf("day") )
      {
        ev.date_fin_prevue = ev.init_date_fin_prevue;
      }
    }
  }
  return;
};


  // overriding update method to add dp and fp values to be updated 
  var old_update = ysy.view.GanttTask.prototype.update;
  ysy.view.GanttTask.prototype.update = function (item, keys) {
    var obj;
    if (item.type === "milestone") {
      this.model.set({
        name: item.text,
        start_date: moment(item.start_date),
        _noDate: false
      });
    } else if (item.type === "project") {
      obj = {
        start_date: moment(item.start_date),
        end_date: moment(item.end_date),
        _shift: item.start_date.diff(this.model.start_date, "days") + (this.model._shift || 0)
      };
      obj.end_date._isEndDate = true;
      this.model.set(obj);
    } else {
      var fullObj = {
        name: item.text,
        //assignedto: item.assignee,
        estimated_hours: item.estimated,
        done_ratio: item.progress * 100,
        start_date: moment(item.start_date),
        end_date: moment(item.end_date),
        date_debut_prevue: item.date_debut_prevue.split('T')[0]
      };
      if(item.date_fin_prevue){
        fullObj["date_fin_prevue"] = item.date_fin_prevue.split('T')[0] ;
      }
      fullObj.end_date._isEndDate = true;
      if (item._parentChanged) {
        $.extend(fullObj, this._constructParentUpdate(item.parent));
        item._parentChanged = false;
      }
      obj = fullObj;
      if (keys !== undefined) {
        obj = {};
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          if (key === "fixed_version_id") {
            if (typeof item.parent === "string") {
              obj.fixed_version_id = parseInt(item.parent.substring(1));
            } else {
              obj.parent = item.parent;  // TODO subtask žížaly musí mít parent nebo něco
            }
            //this.parent.requestRepaint();
          } else {
            obj[key] = fullObj[key];
          }
        }
      }
      this.model.set(obj);
    }
    this.requestRepaint();
  };
  // Redefining  fix working times function to add dp and fp 
  var old_fix_working_times = gantt._tasks_dnd._fix_working_times;
  gantt._tasks_dnd._fix_working_times = function(task, drag){
    old_fix_working_times.call(this, task, drag);
    // resize from task's start date
    // update DP
    if(this.drag.left && this.drag.mode == 'resize')
    {
      if (task.start_date >= moment(new Date()).startOf("day")) 
      {
        task.date_debut_prevue = task.start_date.toISOString(true);
        return;
      }
      else 
      {
        var r=confirm("Les dates saisies doivent être > date du jour! \nAppuyez sur Ok pour mettre la tâche sur la date du jour\nSinon annuler");
        if (r==true)
        {
          task.start_date = moment(new Date()).startOf("day");
          task.end_date = gantt._working_time_helper.add_worktime(moment(new Date()).startOf("day"), task.init_duration, "day", true);
          task.date_debut_prevue = task.start_date.toISOString(true);
          return;
        }
        else
        {
          task.start_date = task.init_start_date;
          task.end_date = task.init_end_date;
          return;
        }
      }
    }
    // resize from task's end date and no progress
    // update DP
    if(!this.drag.left && this.drag.mode == 'resize' && task.progress==0)
    {
      if (task.end_date < moment(new Date()).startOf("day")) 
      {
        var r=confirm("Les dates saisies doivent être > date du jour! \nAppuyez sur Ok pour mettre la tâche sur la date du jour \nSinon annuler");
        if (r==true)
        {
          task.start_date = moment(new Date()).startOf("day");
          task.end_date = gantt._working_time_helper.add_worktime(moment(new Date()).startOf("day"), task.init_duration, "day", true);
          task.date_debut_prevue = task.start_date.toISOString(true);
          return;
        }
        else
        {
          task.end_date = task.init_end_date;
          return;
        }
      }
      else
      {
        if (task.start_date < moment(new Date()).startOf("day")) 
        {
          var r=confirm("Les dates saisies doivent être > date du jour! \nAppuyez sur Ok pour mettre la tâche sur la date du jour \nSinon annuler");
          if (r==true)
          {
            task.start_date = moment(new Date()).startOf("day");
            task.date_debut_prevue = task.start_date.toISOString(true);
            task.end_date = gantt._working_time_helper.add_worktime(moment(new Date()).startOf("day"), task.init_duration, "day", true);
            return;
          }
          else
          {
            task.start_date = task.init_start_date;
            task.end_date = task.init_end_date;
            task.date_debut_prevue = task.init_date_debut_prevue;
            return;
          }
        }
      }
    }
    // resize from task's end_date and progress
    // update FP
    if(!this.drag.left && this.drag.mode == 'resize' && task.progress > 0)
    {
      if (task.end_date < moment(new Date()).startOf("day")) 
      {
        var r=confirm("Les dates saisies doivent être > date du jour! \nAppuyez sur Ok pour mettre la tâche sur la date du jour \nSinon annuler");
        if (r==true)
        {
          task.end_date =  moment(new Date()).startOf("day")
          task.date_fin_prevue = moment(new Date()).startOf("day").toISOString(true);
          return;
        }
        else
        {
          task.end_date = task.init_end_date;
          return;
        }
      }
      else
      {
        task.date_fin_prevue = task.end_date.toISOString(true);
        return;
      }
    }
    // if bar move and no progress
    // update DP 
    if(this.drag.mode == 'move' && task.progress == 0)
    {
      if (task.start_date >= moment(new Date()).startOf("day") || task.tracker_id == parseInt(trackers['jalon_tracker_id']))
      {
        task.date_debut_prevue = task.start_date.toISOString(true);
        return;
      }
      else 
      {
        var r=confirm("Les dates saisies doivent être > date du jour! \nAppuyez sur Ok pour mettre la tâche sur la date du jour \nSinon annuler");
        if (r==true)
        {
          task.start_date = moment(new Date()).startOf("day");
          task.end_date = gantt._working_time_helper.add_worktime(moment(new Date()).startOf("day"), task.init_duration, "day", true);
          task.date_debut_prevue = task.start_date.toISOString(true);
          return;
        }
        else
        {
          task.start_date = task.init_start_date;
          task.end_date = task.init_end_date;
          return;
        }
      }
    }
    if(this.drag.mode == 'progress' && task.progress == 1 &&task.tracker_id == parseInt(trackers['tl_tracker_id']))
    {
      task.end_date = moment(new Date());
    }
  };

  // redefining move function to add progress condition 
  var old_move_tasks = gantt._tasks_dnd._move;
  gantt._tasks_dnd._move = function(ev, shift, drag){
    // The bar should not move if we have progress or the task is closed
    if(ev.progress != 0 || ev.date_fin_reel )
    {
      return;
    }
    old_move_tasks.call(this, ev, shift, drag);
    // Update DP when moving the bar and when OT
    if(ev.tracker_id == parseInt(trackers['ot_tracker_id'])){
      if (ev.start_date >= moment(new Date()).startOf("day"))
      {
        ev.date_debut_prevue = ev.start_date.toISOString(true);
      }
      if (ev.start_date < moment(new Date()).startOf("day") )
      {
        ev.date_debut_prevue = ev.init_date_debut_prevue;
      } 
    }
  };

  // override _render_pair to manage render on left and right drag
  var old_render_pair = gantt._render_pair;
  gantt._render_pair = function(parent, css, task, content){
    old_render_pair.call(parent, css, task, content);
    var state = gantt.getState();
    // render left drag if no progress and if OT
    if (+task.start_date >= +state.min_date && task.progress == 0 && !task.date_fin_reel )
    {
      if (css == "gantt_task_drag" && task.tracker_id == parseInt(trackers['jalon_tracker_id']))
      {
        return;
      }
      else
      {
        parent.appendChild(content(css + " task_left"));
      }
    }
    // render right drag if OT and if OT is not open
    // task open means we don't have a real end date
    if(+task.end_date <= +state.max_date && !task.date_fin_reel )
    {
      if (css == "gantt_task_drag" && task.tracker_id == parseInt(trackers['jalon_tracker_id']))
      {
        return;
      }
      else
      {
        parent.appendChild(content(css + " task_right"));
      }
    }
  };

  // save tasks ids that have tracker Tache Local in array 
  // saved ids are used to render progress handle
  var tasks_tl = [];
  function checkArr() {
    for (let i of ysy.data.issues.array) 
    {
      if (i.tracker_id == parseInt(trackers['tl_tracker_id']))
      {
        if(!tasks_tl.includes(i.id))
        {
          tasks_tl.push(i.id);
        }
      }
    }
  }
  
  // deactivate progress handle 
  gantt._render_task_progress_drag = function(element,width)
  {
    checkArr();
    if (tasks_tl.includes(parseInt($(element).attr('task_id'))))
    {
      var drag = document.createElement("div");
      drag.style.left = width + 'px';
      drag.className = "gantt_task_progress_drag";
      element.appendChild(drag);
    }
    else
    {
      return null ;
    }
  }

  // override mouse move to manage moving tasks 
  var old_on_mouse_move = gantt._tasks_dnd.on_mouse_move;
  gantt._tasks_dnd.on_mouse_move = function(e)
  {
    if(this.drag.start_drag)
    {
      if(this.drag.start_drag.obj.tracker_id == parseInt(trackers['of_tracker_id']))
      {
        return;
      }
      if(this.drag.start_drag.obj.tracker_id == parseInt(trackers['jalon_tracker_id'])  && !jalon_roles.some( ai => current_user_roles.includes(ai)))
      {
        return;
      }
      if(this.drag.start_drag.mode == "move" && this.drag.start_drag.obj.progress > 0)
      {
        return;
      }
      if(this.drag.start_drag.mode == "resize")
      {
        var current_position = gantt._get_mouse_pos(e);
        var min_position_x = current_position["x"] - 15;
        if(gantt.posFromDate(this.drag.start_drag.obj.date_debut_plutot) >= min_position_x)
        {
          return;
        }
      }
      // Added condition for OT 
      if(this.drag.start_drag.mode == "move" && this.drag.start_drag.obj.tracker_id == parseInt(trackers['ot_tracker_id']))
      {
        var pos = gantt._get_mouse_pos(e);
        var shift = {x:pos.x - this.drag.start_drag.start_x,y:pos.y - this.drag.start_drag.start_y};
        var ev = gantt.getTask(this.drag.start_drag.id);
        var coords_x = this._drag_task_coords(ev, this.drag.start_drag);
        var new_start = gantt._working_time_helper.get_closest_worktime({
          date:moment(gantt.dateFromPos(coords_x.start + shift.x)),
          dir:"future"
        });
        var moment_date_debut_plutot = moment(this.drag.start_drag.obj.date_debut_plutot);
        if(+moment_date_debut_plutot >= +new_start)
        {
          return;
        }
      }
      this._start_dnd(e);
    }
    var drag = this.drag;
    if (drag.mode)
    {
      // if its OF task cant move 
      if(drag.obj.tracker_id == parseInt(trackers['of_tracker_id']))
      {
        return;
      }
      if(drag.mode == "move" && drag.obj.progress > 0)
      {
        return;
      }
      if(drag.mode == "resize")
      {
        var current_position = gantt._get_mouse_pos(e);
        var min_position_x = current_position["x"] - 15;
        if(gantt.posFromDate(drag.obj.date_debut_plutot) >= min_position_x)
        {
          return;
        }
      }
      // works only if NOT JALON
      if(drag.mode == "move" && this.drag.obj.tracker_id != parseInt(trackers['jalon_tracker_id']))
      {
        var pos = gantt._get_mouse_pos(e);
        var shift = {x:pos.x - drag.start_x,y:pos.y - drag.start_y};
        var ev = gantt.getTask(drag.id);
        var coords_x = this._drag_task_coords(ev, drag);
        var new_start = gantt._working_time_helper.get_closest_worktime({
          date:moment(gantt.dateFromPos(coords_x.start + shift.x)),
          dir:"future"
        });
        var new_end = gantt._working_time_helper.add_worktime(new_start, ev.duration, "day", true); //< HOSEKP
        gantt.multiStop(ev, new_start, new_end, drag.limits);
        var moment_date_debut_plutot = moment(drag.obj.date_debut_plutot);
        if(+moment_date_debut_plutot >= +new_start)
        {
          return;
        }
      }
      //if(!e.movementX && !e.movementY) return;
      if(!drag.last_event){
        setTimeout($.proxy(this._update_on_move,this),5);
      }
      drag.last_event=e;
    }
  };
  // Override : saving only issues that have id > 0 
  ysy.data.saver.sendIssues = function()
  {
    var j, data;
    var issues = ysy.data.issues.array;
    for (j = 0; j < issues.length; j++) 
    {
      var issue = issues[j];
      if (!issue._changed) continue;
      if (issue._deleted && issue._created) continue;
      if (!issue._deleted && !issue._created)
      {
        data = {};
        for (key in issue) 
        {
          if (!issue.hasOwnProperty(key)) continue;
          if (ysy.main.startsWith(key, "_"))continue;
          data[key] = issue[key];
        }
        delete data["end_date"];
        delete data["columns"];
        if (ysy.settings.showTasksSpentTimeRatio) delete data.done_ratio;
        $.extend(data, {
          start_date: issue.start_date ? issue.start_date.format("YYYY-MM-DD") : undefined,
          due_date: issue.end_date ? issue.end_date.format("YYYY-MM-DD") : undefined
        });
        ysy.proManager.fireEvent("beforeSaveIssue", data);
        data = issue.getDiff(data);
        if (data === null) 
        {
          this.callbackBuilder(issue)();
          continue;
        }
        if(issue.id > 0)
        {
          ysy.gateway.sendIssue("PUT", issue.id, {issue: data}, this.callbackBuilder(issue));
        }
      }
    }
  }

  // remove ticks 
  gantt.hasChild = function(id) {
    if(id < 0){
      return false;
    }
    return (dhtmlx.defined(this._branches[id]) && this._branches[id].length);
  };

  //update text color
  var old_render_grid_item = gantt._render_grid_item;
  gantt._render_grid_item = function (item) {
    var result = old_render_grid_item.call(this, item);
    var lbl_activite_cf_id_class = "gantt_grid_body_cf_"+custom_fields['lbl_activite_cf_id']
    if($(result).find("div."+lbl_activite_cf_id_class).length != 0 && item.tracker_id == parseInt(trackers['of_tracker_id']))
    {
      var cf_field = "cf_"+ custom_fields['lbl_activite_cf_id'];
      var col = this.getGridColumns().find( ({ name }) => name === cf_field );
      value = col.template(item);
      var new_div = document.createElement("div");
      new_div.innerHTML = value;
      new_div.className = "gantt_tree_content";
      new_div.style.color = "blue";
      result.replaceChild(new_div, result.getElementsByClassName(lbl_activite_cf_id_class)[0]);
    }
    result.innerHTML = result.innerHTML.replace("gantt_drag_handle", "");
    return result;
  }

  // Antecedent table ajax 
  gantt._click.gantt_link_control = dhtmlx.bind(function(e){
    var id = gantt.locate(e);
    var taskPos = $(e.target).offset();
    if (e.target.parentElement.classList.contains("task_left")){
      if (document.getElementById("antecedent_"+id)) {
        $('.gantt_task_antecedent_container').hide();
        $('.gantt_task_consequent_container').hide();
        $("#antecedent_"+id).show()
      } else {
        if(id){
          $.ajax({
            beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token',$('meta[name="csrf-token"]').attr('content'))},
            url: "/relation_display_antecedents",
            type: "POST",
            data: { my_param: id },
            success: function(result) {
              if (!result.length){
                $('.gantt_task_antecedent_container').hide();
                $('.gantt_task_consequent_container').hide();
                var container = document.createElement("div");
                container.className = "gantt_task_antecedent_container";
                container.style.top = taskPos.top - 10 + "px";
                // container.style.left = taskPos.left + "px";
                container.innerHTML = "La tâche n'a pas d'antecedents ";
                $(container).attr('id', "antecedent_"+id);
                $(container).addClass('warn');
                var button = document.createElement("button");
                button.className ="close-btn";
                button.style.transform = 'translateY(-71%)';
                container.appendChild(button);
                $("#content").append(container);
              }
              else 
              {
                var col = [];
                for (var i = 0; i < result.length; i++) {
                  for (var key in result[i]) {
                    if (col.indexOf(key) === -1) {
                      col.push(key);
                    }
                  }
                }
                var colheaders = ["Ordre", "PdT", "Op","Libellé ordre","%", "Lien","DP", "FP", "Ftôt", "Local"];

                // CREATE DYNAMIC TABLE.
                $('.gantt_task_antecedent_container').hide();
                $('.gantt_task_consequent_container').hide();
                var table = document.createElement("table");
                var container = document.createElement("div");
                table.className = "gantt_task_antecedent_table";
                container.className = "gantt_task_antecedent_container";
                container.style.top = taskPos.top - 10 + "px";
                $(container).attr('id', "antecedent_"+id);
                // CREATE CLOSE BUTTON.
                var button = document.createElement("button")
                button.className ="close-btn"
                // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
                var tr = table.insertRow(-1);                   // TABLE ROW.
                for (var i = 0; i < col.length; i++) {
                  var th = document.createElement("th");      // TABLE HEADER.
                  th.innerHTML = colheaders[i];
                  tr.appendChild(th);
                }
                // ADD JSON DATA TO THE TABLE AS ROWS.
                for (var i = 0; i < result.length; i++) {
                  tr = table.insertRow(-1);
                  for (var j = 0; j < col.length; j++) {
                    var tabCell = tr.insertCell(-1);
                    tabCell.innerHTML = result[i][col[j]];
                  }
                }
                container.appendChild(button)
                container.appendChild(table)
                $("#content").append(container);
                $(".gantt_task_antecedent_table tr").each(function () {
                  $(".gantt_task_antecedent_table td").each(function() {
                    if ($(this).text() === "Oui")
                    {
                      $(this).parent().addClass("local");
                    }
                    else if ($(this).text() === "Non")
                    {
                      $(this).parent().addClass("sap");
                    }
                   })
                });
              }
            }
          });
        }
      }
    }
    else
    {
      if (document.getElementById("consequent_"+id)) {
        $('.gantt_task_antecedent_container').hide();
        $('.gantt_task_consequent_container').hide();
        $("#consequent_"+id).show()
      } else {
        if(id){
          $.ajax({
            beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token',$('meta[name="csrf-token"]').attr('content'))},
            url: "/relation_display_consequents",
            type: "POST",
            data: { my_param: id },
            success: function(result) {
              if (!result.length){
                $('.gantt_task_antecedent_container').hide();
                $('.gantt_task_consequent_container').hide();
                var container = document.createElement("div");
                container.className = "gantt_task_consequent_container";
                container.style.top = taskPos.top - 10 + "px";
                // container.style.left = taskPos.left + "px";
                container.innerHTML = "La tâche n'a pas des consequents ";
                $(container).attr('id', "consequent_"+id);
                $(container).addClass('warn');
                var button = document.createElement("button");
                button.className ="close-btn";
                button.style.transform = 'translateY(-71%)';
                container.appendChild(button);
                $("#content").append(container);
              }
              else 
              {
                var col = [];
                for (var i = 0; i < result.length; i++) {
                  for (var key in result[i]) {
                    if (col.indexOf(key) === -1) {
                      col.push(key);
                    }
                  }
                }
                var colheaders = ["Ordre", "PdT", "Op","Libellé ordre","%", "Lien","DP", "FP", "Ftôt", "Local"];

                // CREATE DYNAMIC TABLE.
                $('.gantt_task_antecedent_container').hide();
                $('.gantt_task_consequent_container').hide();
                var table = document.createElement("table");
                var container = document.createElement("div");
                table.className = "gantt_task_consequent_table";
                container.className = "gantt_task_consequent_container";
                container.style.top = taskPos.top - 10 + "px";
                // container.style.left = taskPos.left + "px";
                $(container).attr('id', "consequent_"+id);
                // CREATE CLOSE BUTTON.
                var button = document.createElement("button")
                button.className ="close-btn"
                // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
                var tr = table.insertRow(-1);                   // TABLE ROW.
                for (var i = 0; i < col.length; i++) {
                  var th = document.createElement("th");      // TABLE HEADER.
                  th.innerHTML = colheaders[i];
                  tr.appendChild(th);
                }
                // ADD JSON DATA TO THE TABLE AS ROWS.
                for (var i = 0; i < result.length; i++) {
                  tr = table.insertRow(-1);
                  for (var j = 0; j < col.length; j++) {
                    var tabCell = tr.insertCell(-1);
                    tabCell.innerHTML = result[i][col[j]];
                  }
                }
                container.appendChild(button)
                container.appendChild(table)
                $("#content").append(container);

                $(".gantt_task_consequent_table tr").each(function () {
                  $(" .gantt_task_consequent_table td").each(function() {
                    if ($(this).text() === "Oui")
                    {
                      $(this).parent().addClass("local_c");
                    }
                    else if ($(this).text() === "Non")
                    {
                      $(this).parent().addClass("sap_c");
                    }
                   })
                });
              }
            }
          });
        }
      }
    }
  });

  // Antecedent table close button event 
  $( document ).ready(function() {
    $('body').on('click', 'button.close-btn', function() {
      $(this).parent().fadeOut(400);
    });
  });
  var old_ysy_view_leftGrid_constructColumns = ysy.view.leftGrid.constructColumns;
  // var old_gantt_getGridColumns = gantt.getGridColumns ; 
  ysy.view.leftGrid.constructColumns = function (columns) {
    var configuredColumns = old_ysy_view_leftGrid_constructColumns.call(this, columns);
    configuredColumns.forEach(function(col) {
      switch(col.name) {
        case "cf_"+ parseInt(custom_fields['lbl_ordre_cf_id']):
          col.width = parseInt(col_widths['lbl_order_width'])
          col.min_width = parseInt(col_widths['lbl_order_width'])
          break;
        case "cf_"+ parseInt(custom_fields['pdt_cf_id']):
          col.width = parseInt(col_widths['pdt_width'])
          col.min_width = parseInt(col_widths['pdt_width'])
          break;
        case "cf_"+ parseInt(custom_fields['opt_cf_id']):
          col.width = parseInt(col_widths['opt_width'])
          col.min_width = parseInt(col_widths['opt_width'])
          break;
        case "cf_"+ parseInt(custom_fields['ident_cf_id']):
          col.width = parseInt(col_widths['ident_width'])
          col.min_width = parseInt(col_widths['ident_width'])
          break;
        case "cf_"+ parseInt(custom_fields['niveau_cf_id']):
          col.width = parseInt(col_widths['niveau_width'])
          col.min_width = parseInt(col_widths['niveau_width'])
          break;
        case "cf_"+ parseInt(custom_fields['phase_cf_id']):
          col.width = parseInt(col_widths['phase_width'])
          col.min_width = parseInt(col_widths['phase_width'])
          break;
        case "cf_"+ parseInt(custom_fields['lbl_activite_cf_id']):
          col.width = parseInt(col_widths['lbl_activite_width'])
          col.min_width = parseInt(col_widths['lbl_activite_width'])
          break;
        case "cf_"+ parseInt(custom_fields['domaine_cf_id']):
          col.width = parseInt(col_widths['domaine_width'])
          col.min_width = parseInt(col_widths['domaine_width'])
          break;
        
        default:
          // code block
      } 
    })
    return configuredColumns;
  };

  // Disable issue modal (on task double click || task subject click)
  gantt.openIssueModal = (id, options) => {
    return;
  }
  // gives width to div that contains columns
  ysy.view.leftGrid.columnsWidth.grid_width = $('.gantt_grid_scale').width();

  gantt._init_links_dnd = function() {
    return;
  };

}